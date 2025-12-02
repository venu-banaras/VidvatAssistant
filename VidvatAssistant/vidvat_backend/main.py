from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json
import ollama
import os


app = FastAPI(title="Vidvat Assistant Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Global state -------- #
ACTIVE_MODEL = None


# -------- Models -------- #

AVAILABLE_MODELS = [
    "qwen3-coder",
    "codegemma",
    "codestral"
]

class SetModelRequest(BaseModel):
    model: str

class ChatRequest(BaseModel):
    prompt: str



CONFIG_PATH = os.path.expanduser("~/.vidvat/config.json")

def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}

def save_config(data):
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump(data, f)

config = load_config()
ACTIVE_MODEL = config.get("active_model")


# -------- Helpers -------- #

def pull_model(model):
    try:
        subprocess.check_call(["ollama", "pull", model])
    except Exception as e:
        raise HTTPException(500, f"Failed to download model: {str(e)}")


# -------- Endpoints -------- #

@app.get("/available_models")
def list_available():
    return {"models": AVAILABLE_MODELS}


@app.post("/set_model")
def set_model(req: SetModelRequest):
    global ACTIVE_MODEL
    
    if req.model not in AVAILABLE_MODELS:
        raise HTTPException(400, "Invalid model")

    # tell UI that model is starting to download
    is_downloaded = False
    try:
        pull_model(req.model)
        is_downloaded = True
    except:
        raise

    ACTIVE_MODEL = req.model

    # save to config
    save_config({"active_model": ACTIVE_MODEL})

    return {
        "status": "ok",
        "active_model": ACTIVE_MODEL,
        "downloaded": is_downloaded
    }


@app.post("/chat")
def chat(req: ChatRequest):
    if not ACTIVE_MODEL:
        raise HTTPException(400, "No model selected. Go to Settings and choose a model.")

    try:
        response = ollama.chat(
            model=ACTIVE_MODEL,
            messages=[{"role": "user", "content": req.prompt}]
        )
        return {"response": response["message"]["content"]}
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/")
def root():
    return {"status": "Vidvat backend running", "active_model": ACTIVE_MODEL}
