import os
import json
import uuid
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

from script_gen import generate_script
from audio_gen import generate_audio

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve audio files
if not os.path.exists("audio"):
    os.makedirs("audio")
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

client = Client(api_key=os.getenv("XAI_API_KEY"))

class VideoScriptRequest(BaseModel):
    topic: str

class VideoScriptResponse(BaseModel):
    script: str

class BriefingRequest(BaseModel):
    topic: str

class BriefingResponse(BaseModel):
    script: str # This is the JSON string of the briefing
    audio_url: str

@app.post("/generate-briefing", response_model=BriefingResponse)
async def generate_briefing(request: BriefingRequest):
    """Generate a news briefing, script, and audio podcast."""
    if not os.getenv("XAI_API_KEY"):
        raise HTTPException(status_code=500, detail="XAI_API_KEY not configured")
    
    try:
        # 1. Generate Briefing Content (JSON text)
        chat = client.chat.create(
            model="grok-4-1-fast",
            tools=[x_search(enable_image_understanding=True, enable_video_understanding=True)],
            include=["verbose_streaming"],
        )
        
        # System prompt for briefing
        chat.append(
            user("You are a news analyst. Return ONLY valid JSON with this structure: {\"headline\": \"engaging title\", \"summary\": \"2-3 sentence overview\", \"confirmed_facts\": [\"fact1\", \"fact2\", \"fact3\"], \"unconfirmed_claims\": [\"claim1\", \"claim2\"], \"recent_changes\": [\"update1\"], \"watch_next\": [\"related_topic1\", \"related_topic2\"], \"sources\": [{\"account_handle\": \"@username\", \"display_name\": \"Full Name\", \"post_url\": \"https://x.com/...\", \"label\": \"official|journalist|eyewitness|other\"}]}")
        )
        
        # User request
        chat.append(user(f"Generate a news briefing for: {request.topic}"))
        
        # Stream and collect response
        content = ""
        for response, chunk in chat.stream():
            if chunk.content:
                content += chunk.content

        print(f"Briefing Content Generated: {len(content)} chars")

        # 2. Generate Script from Briefing Content
        full_audio_url = ""
        try:
            briefing_json = json.loads(content)
            print("Briefing JSON parsed successfully.")
            
            script_segments = generate_script(briefing_json)
            # script_gen returns a list of segments
            
            # 3. Generate Audio
            filename = f"podcast_{uuid.uuid4().hex}.wav"
            audio_url = await generate_audio(script_segments, filename)
            
            # Convert audio_url (relative path) to full URL if needed, or keeping it relative is fine for the frontend if using valid base URL
            # For now, we return relative "/audio/filename.wav"
            full_audio_url = f"http://localhost:8000{audio_url}"
            
        except json.JSONDecodeError:
            print("Failed to parse briefing JSON for script generation.")
            full_audio_url = ""
        except Exception as e:
            print(f"Error during podcast generation: {e}")
            full_audio_url = ""
        
        return BriefingResponse(script=content, audio_url=full_audio_url)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating briefing: {str(e)}")

@app.post("/generate-script", response_model=VideoScriptResponse)
async def generate_script(request: VideoScriptRequest):
    """Generate a video script using Grok API based on the given topic."""
    if not os.getenv("XAI_API_KEY"):
        raise HTTPException(status_code=500, detail="XAI_API_KEY not configured")
    
    try:
        chat = client.chat.create(
            model="grok-4-1-fast",
            tools=[x_search(enable_image_understanding=True, enable_video_understanding=True)],
            include=["verbose_streaming"],
        )
        
        # System prompt
        chat.append(
            user("You are an expert video scriptwriter and researcher. Return ONLY valid JSON with this structure: {\"headline\": \"title\", \"summary\": \"2-3 sentence overview\", \"confirmed_facts\": [\"fact1\", \"fact2\", \"fact3\"], \"unconfirmed_claims\": [\"claim1\"], \"recent_changes\": [\"change1\"], \"watch_next\": [\"topic1\"], \"script\": \"full 2-5 minute video script\"}")
        )
        
        # User request
        chat.append(user(f"Generate content for topic: {request.topic}"))
        
        # Stream and collect response
        script_content = ""
        for response, chunk in chat.stream():
            if chunk.content:
                script_content += chunk.content
        
        return VideoScriptResponse(script=script_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating script: {str(e)}")

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)