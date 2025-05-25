from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class ChatRequest(BaseModel):
    patient_id: int
    message: str

class ChatResponse(BaseModel):
    response: str

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/chat/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        logger.info(f"Sending request to Rasa: {request}")
        rasa_response = requests.post(
            "http://chatbot_rasa:5005/webhooks/rest/webhook",
            json={"sender": str(request.patient_id), "message": request.message},
            timeout=5
        )
        rasa_response.raise_for_status()
        responses = rasa_response.json()
        logger.info(f"Rasa response: {responses}")
        response_text = " ".join([msg.get("text", "") for msg in responses if "text" in msg])
        if not response_text:
            logger.warning("No text in Rasa response")
            response_text = "Không có phản hồi từ chatbot."
        return ChatResponse(response=response_text)
    except requests.RequestException as e:
        logger.error(f"Error communicating with Rasa: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi giao tiếp với Rasa: {str(e)}")