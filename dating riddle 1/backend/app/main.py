import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import (
    IcebreakerRequest, IcebreakerResponse,
    ReplyCoachRequest, ReplyCoachResponse,
    RescueRequest, RescueResponse,
    RewriteRequest, RewriteResponse,
    SafetyCheckRequest, SafetyReport,
    BioRequest, BioResponse,
    ScreenshotAnalysisRequest, ScreenshotAnalysisResponse,
    DeliveryAdviceRequest, DeliveryAdviceResponse,
    UserFeedbackRequest
)
from app.services.llm_service import LLMService
from app.services.safety_service import analyze_respect_and_safety
from app.services.supabase_service import SupabaseService

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Icebreaker AI API — Contextual conversation opener, reply coach, conversation rescuer, and respect guard."
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCENARIOS_PATH = Path(__file__).parent / "data" / "scenarios.json"

@app.get("/")
def read_root():
    return {
        "app": "Icebreaker AI",
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs",
        "motto": "Turn awkward silences into natural conversations"
    }

@app.get("/api/health")
def health_check():
    has_openai = bool(settings.OPENAI_API_KEY)
    has_groq = bool(settings.GROQ_API_KEY)
    has_supabase = bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)
    
    active_engine = "OpenAI GPT-4o-mini" if has_openai else ("Groq LLaMA-3.1" if has_groq else "Smart Heuristic Engine (Zero-Latency)")

    return {
        "status": "healthy",
        "engine": active_engine,
        "llm_key_present": has_openai or has_groq,
        "supabase_connected": has_supabase,
        "version": settings.VERSION
    }

@app.get("/api/scenarios")
def get_scenarios():
    if SCENARIOS_PATH.exists():
        with open(SCENARIOS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.post("/api/icebreakers", response_model=IcebreakerResponse)
async def create_icebreakers(req: IcebreakerRequest):
    try:
        response = await LLMService.generate_icebreakers(req)
        # Log to Supabase / memory store
        await SupabaseService.save_session_event("icebreaker_generated", {
            "setting": req.setting,
            "vibe": req.vibe,
            "options_count": len(response.options)
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Icebreaker generation error: {str(e)}"
        )

@app.post("/api/reply-coach", response_model=ReplyCoachResponse)
async def reply_coach(req: ReplyCoachRequest):
    try:
        response = await LLMService.generate_reply_coach(req)
        await SupabaseService.save_session_event("reply_coached", {
            "intent": req.desired_intent,
            "vibe": req.vibe
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Reply coach error: {str(e)}"
        )

@app.post("/api/rescue", response_model=RescueResponse)
async def rescue_conversation(req: RescueRequest):
    try:
        response = await LLMService.generate_rescue(req)
        await SupabaseService.save_session_event("conversation_rescued", {
            "stall_reason": req.stall_reason
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Rescue error: {str(e)}"
        )

@app.post("/api/rewrite", response_model=RewriteResponse)
async def rewrite_tone(req: RewriteRequest):
    try:
        response = await LLMService.rewrite_message(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Rewrite error: {str(e)}"
        )

@app.post("/api/bio-builder", response_model=BioResponse)
async def create_dating_bios(req: BioRequest):
    try:
        response = await LLMService.generate_bios(req)
        await SupabaseService.save_session_event("bio_generated", {
            "platform": req.platform,
            "archetype": req.archetype
        })
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bio generation error: {str(e)}"
        )

@app.post("/api/screenshot-analyze", response_model=ScreenshotAnalysisResponse)
async def analyze_screenshot(req: ScreenshotAnalysisRequest):
    try:
        response = await LLMService.analyze_screenshot(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Screenshot analysis error: {str(e)}"
        )

@app.post("/api/delivery-advice", response_model=DeliveryAdviceResponse)
async def delivery_advice(req: DeliveryAdviceRequest):
    try:
        response = await LLMService.get_delivery_advice(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Delivery advice error: {str(e)}"
        )

@app.post("/api/safety-check", response_model=SafetyReport)
def safety_check(req: SafetyCheckRequest):
    return analyze_respect_and_safety(req.text, req.context or "")


@app.post("/api/feedback")
async def record_feedback(req: UserFeedbackRequest):
    await SupabaseService.save_session_event("user_feedback", req.model_dump())
    return {"status": "success", "message": "Feedback recorded for model evaluation benchmark."}

@app.get("/api/history")
def get_history():
    return SupabaseService.get_recent_events(limit=15)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
