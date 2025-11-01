import fs from "fs";
import path from "path";
import express from "express";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { UploadPost } from "upload-post";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIG ===
const WAN_REPO_PATH = process.env.WAN_REPO_PATH;
const WAN_MODEL_TASK = process.env.WAN_MODEL_TASK ;
const WAN_SIZE = process.env.WAN_SIZE;
const OUTPUT_DIR = process.env.OUTPUT_DIR;
const PUBLIC_DOMAIN = process.env.PUBLIC_DOMAIN;
const PUBLIC_PORT = process.env.PUBLIC_PORT || 8080;
const UPLOAD_POST_API_KEY = process.env.UPLOAD_POST_API_KEY;
const UPLOAD_POST_USER = process.env.UPLOAD_POST_USER || "default-user";

// === EXPRESS STATIC SERVER ===
const app = express();
app.use("/output", express.static(OUTPUT_DIR));
app.listen(PUBLIC_PORT, () => {
  console.log(`🌐 Public server running at ${PUBLIC_DOMAIN}/output/`);
});

// === HELPERS ===
function getPublicVideoUrl(videoPath) {
  const filename = path.basename(videoPath);
  return `${PUBLIC_DOMAIN}/output/${filename}`;
}

async function runLlamaPrompt() {
  return new Promise((resolve, reject) => {
	  const prompt = `You are a creative short video prompt generator.
Produce ONE short, visual prompt (10–25 words) for an inspiring Instagram Reel video.
Focus on emotionally resonant visuals, moods, and camera actions that people can connect with.
Example: "Soft morning light spills through curtains onto a steaming coffee cup, camera pans to a handwritten note."
Return only the prompt text.`;
    const llama = spawn("ollama", ["run", "llama3"], { stdio: ["pipe", "pipe", "pipe"] });
    llama.stdin.write(prompt);
    llama.stdin.end();

    let output = "";
    llama.stdout.on("data", (d) => (output += d.toString()));
    llama.stderr.on("data", (d) => process.stderr.write(d));

    llama.on("close", (code) => {
      if (code !== 0) return reject(new Error("Llama3 generation failed"));
      const cleaned = output.trim().replace(/^"|"$/g, "");
      console.log("🧠 Llama3 prompt:", cleaned);
      resolve(cleaned);
    });
  });
}

function runWan(prompt) {
  return new Promise((resolve, reject) => {
    const args = [
      "generate.py",
      "--task", WAN_MODEL_TASK,
      "--size", WAN_SIZE,
      "--ckpt_dir", "./Wan2.1-T2V-1.3B",
      "--sample_shift", "8",
      "--sample_guide_scale", "6",
      "--prompt", prompt,
    ];

    const py = spawn("python3", args, { cwd: WAN_REPO_PATH, stdio: ["pipe", "pipe", "pipe"] });

    let stderr = "";
    py.stdout.on("data", (d) => process.stdout.write(d));
    py.stderr.on("data", (d) => { stderr += d.toString(); process.stderr.write(d); });

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Wan2.1 exited ${code}: ${stderr}`));
      }

      const files = fs.readdirSync(WAN_REPO_PATH)
        .filter(f => f.endsWith(".mp4") || f.endsWith(".mov"))
        .map(f => ({ f, t: fs.statSync(`${WAN_REPO_PATH}/${f}`).mtimeMs }))
        .sort((a, b) => b.t - a.t);

      if (!files.length) return reject(new Error("No video produced by Wan2.1"));
      const latestFile = `${WAN_REPO_PATH}/${files[0].f}`;

      if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      const destPath = `${OUTPUT_DIR}/${files[0].f}`;
      fs.renameSync(latestFile, destPath);

      console.log("🎬 Video generated:", destPath);
      resolve(destPath);
    });
  });
}

export async function uploadToInstagramViaUploadPost(localVideoPath, caption = "") {

  if (!UPLOAD_POST_API_KEY) {
    throw new Error("Missing UPLOAD_POST_API_KEY in .env");
  }

  // Resolve absolute path to avoid "file not found" issues
  const videoPath = path.resolve(localVideoPath);

  console.log(`🎬 Uploading video from ${videoPath} to Instagram via UploadPost...`);

  try {
    const uploader = new UploadPost(UPLOAD_POST_API_KEY);

    const result = await uploader.upload(videoPath, {
      title: caption || "AI Generated Video",
      user: UPLOAD_POST_USER,
      platforms: ["instagram"], // Upload-Post supports TikTok, YouTube, Instagram, etc.
    });

    console.log("✅ Upload successful:", result);
    return result;
  } catch (err) {
    console.error("❌ Upload failed:", err.message || err);
    throw err;
  }
}
// === MAIN WORKFLOW ===
async function main() {
  try {
    console.log("🚀 Starting daily video generation...");

    const shortPrompt = await runLlamaPrompt();
    console.log(`prompt :>> `, shortPrompt);

    const videoPath = await runWan(shortPrompt);
    console.log(`videoPath :>> `, videoPath);

    await uploadToInstagramViaUploadPost(videoPath, shortPrompt);
    console.log(`<<: Video Posted on Instagram :>>`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

// Run immediately
await main();

