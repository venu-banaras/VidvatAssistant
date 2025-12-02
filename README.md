# Vidvat Assistant — AI Code Assistant for Visual Studio 2022

Vidvat Assistant is an AI-powered sidebar for Visual Studio 2022 with:

-  Chat interface  
-  Code generation  
-  Code explanation  
-  Model selection (Qwen3-Coder, Codestral, CodeGemma)  
-  Local LLM inference using Ollama  
-  FastAPI backend  
-  WebView2 UI embedded inside VS  

<img src="VidvatAssistant/Resources/G6q8A98bsAATjqh.jpeg" width="400">

---

##  Features

### Seamless Visual Studio Integration
- A top-right corner button (like Copilot) opens a floating panel.
- Four tabs: Chat, Code, Explain, Settings.

### Local LLMs via Ollama
Vidvat supports local, private, GPU-accelerated models:

- `qwen3-coder`
- `codegemma`
- `codestral`

Models are automatically downloaded when selected.

### Backend Included (FastAPI)
A lightweight backend provides:

- `/set_model`  
- `/chat`  
- `/available_models`

Full source included inside `backend/`.

---

## Repository Structure

VidvatAssistant/
├── # VSIX project in the root
├── backend/ # FastAPI + Ollama server
└── README.md


---

## Setup Instructions

### **1. Install Dependencies**
Requires:
- Visual Studio 2022
- Python 3.10+
- Ollama installed (`https://ollama.com`)

### **2. Start Backend**
cd backend
pip install -r requirements.txt
python main.py


### **3. Install Extension**
Download the `.vsix` from Releases and install it.

### **4. Open Vidvat Assistant Panel**
Click the **V** button in the top-right corner of Visual Studio.

---

## Model Selection
Go to **Settings → Select Model**.

Choosing a model will:

1. Download it via `ollama pull`
2. Save it inside `~/.vidvat/config.json`
3. Use it for all chat sessions

---

## Technologies Used
- Visual Studio Extensibility SDK
- WebView2
- WPF
- FastAPI
- Python
- Ollama
- Docker (optional)

---

## Feedback & Issues
Please report bugs and feature requests in the Issues tab.

---

## License
Public license


