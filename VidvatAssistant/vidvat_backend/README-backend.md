# Vidvat Backend

This folder contains the FastAPI backend for Vidvat Assistant.

## Start the backend
pip install -r requirements.txt
python main.py


## Endpoints
- `POST /set_model` – download + activate model  
- `POST /chat` – send prompts  
- `GET /available_models` – list supported models  

## Config
Stored at:
`~/.vidvat/config.json`