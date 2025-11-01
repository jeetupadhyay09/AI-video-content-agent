# 🎬 AI Video Content Agent

> **Autonomous AI agent that creates cinematic short videos and posts them on Instagram — powered by [Llama 3](https://ollama.ai/library/llama3), [Wan 2.1 (T2V)](https://huggingface.co/TencentARC/Wan2.1-T2V-1.3B), and [UploadPost.com](https://upload-post.com).**

![Node](https://img.shields.io/badge/Node.js-v23+-green)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Ollama](https://img.shields.io/badge/-Ollama-000000?style=flat&logo=ollama&logoColor=white)
![HuggingFace](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Model-blue)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

---

## ✨ What It Does

1. 🧠 Generates short cinematic prompts using **Llama 3 (Ollama)**
2. 🎥 Creates videos with **Wan 2.1 (Text-to-Video model)**
3. 📤 Uploads them to **Instagram** automatically using **UploadPost API**

---

## ⚙️ Quick Setup

### 1️⃣ Clone & Install

```bash
git clone https://github.com/jeetupadhyay09/ai-video-content-agent.git
cd ai-video-content-agent
npm install
```

### 2️⃣ Create `.env`

```bash
WAN_REPO_PATH=/absolute/path/to/Wan2.1
WAN_MODEL_TASK=text2video
WAN_SIZE=832*480

OUTPUT_DIR=./output
PUBLIC_DOMAIN=https://yourdomain.com
PUBLIC_PORT=8080

UPLOAD_POST_API_KEY=sk-your-uploadpost-api-key
UPLOAD_POST_USER=jeet
```

---

## 🧠 Step 1: Llama 3 via Ollama

Install Ollama → [ollama.ai/download](https://ollama.ai/download)

```bash
ollama pull llama3
```

Then test:

```bash
ollama run llama3
```

---

## 🎬 Step 2: Wan 2.1 (Text2Video)

Get model from Hugging Face:
👉 [https://huggingface.co/TencentARC/Wan2.1-T2V-1.3B](https://huggingface.co/TencentARC/Wan2.1-T2V-1.3B)

```bash
git clone https://huggingface.co/TencentARC/Wan2.1-T2V-1.3B
```

> ⚠️ GPU required (NVIDIA 12 GB VRAM + recommended)

---

## 🌐 Step 3: UploadPost API

Sign up at [upload-post.com](https://upload-post.com)
Get your API key and add it to `.env`

Supports: `instagram`, `tiktok`, `youtube`, `facebook`, `x`

---

## ▶️ Run the Agent

```bash
npm start
```

It will:

* Generate a short cinematic prompt
* Render a video via Wan 2.1
* Upload it automatically via UploadPost

Example output:

```
🧠 Llama3 prompt: Sunset reflections ripple across a quiet lake.
🎬 Video generated: ./output/sunset_lake.mp4
✅ Uploaded successfully to Instagram
```

---

## 🌍 Public Access

Videos are stored in `./output` and auto-served via Express:

```
https://yourdomain.com/output/<filename>.mp4
```

---

## ⏰ Automate with Cron

Example (run daily at 9 AM): use cron package to automate

---

## 📁 Folder Structure

```
ai-video-content-agent/
├── index.js          # Main agent script
├── .env              # Environment configuration
├── package.json
├── output/           # Generated videos
└── Wan2.1-T2V-1.3B/  # Text2Video model
```

---

## 🧰 Requirements

* Node v23 or later
* Python 3.10 +
* GPU (CUDA 12 +)
* Ollama with Llama 3 model
* UploadPost API key

---

## 🧩 Tech Used

| Component  | Tool               |
| ---------- | ------------------ |
| Prompt Gen | Llama 3 (Ollama)   |
| Video Gen  | Wan 2.1 T2V (1.3B) |
| Upload     | UploadPost API     |
| Web Server | Express .js        |
| Scheduler  | Node-cron          |

---

## 👨‍💻 Author

**Jeet Upadhyay**
AI Automation Engineer • Creative Systems Architect
🌐 [GitHub](https://github.com/jeetupadhyay)

---

## 📚 Resources

* [Ollama Docs](https://ollama.ai/docs)
* [Wan 2.1 on Hugging Face](https://huggingface.co/TencentARC/Wan2.1-T2V-1.3B)
* [UploadPost Docs](https://upload-post.com/docs)
* [Express Static Files](https://expressjs.com/en/starter/static-files.html)

---