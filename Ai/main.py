from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Security
from fastapi.security.api_key import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import tempfile
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from models.cv_parser import parse_cv
from models.skill_extractor import SkillExtractor
from models.matcher import MatchingEngine

API_KEY_NAME = "X-API-Key"
API_KEY = os.environ.get("AI_API_KEY", "smart_job_secret_key_123")
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(status_code=403, detail="Could not validate credentials")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

skill_extractor = SkillExtractor()
matcher = MatchingEngine()

class MatchRequest(BaseModel):
    candidate_skills: List[str]
    job_skills_str: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/parse-cv")
async def parse_cv_endpoint(file: UploadFile = File(...), api_key: str = Depends(get_api_key)):
    allowed = ['.pdf', '.docx', '.txt']
    ext = os.path.splitext(file.filename)[1].lower()
    
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    
    try:
        parsed = parse_cv(tmp_path)
        skills = skill_extractor.extract_from_cv(parsed)
        
        return {
            "success": True,
            "data": {
                "name": parsed.get("name"),
                "email": parsed.get("email"),
                "phone": parsed.get("phone"),
                "location": parsed.get("location"),
                "technical_skills": skills.get("technical", []),
                "soft_skills": skills.get("soft", []),
                "all_skills": skills.get("all", []),
                "education": parsed.get("education", ""),
                "experience": parsed.get("experience", ""),
            }
        }
    finally:
        os.unlink(tmp_path)

@app.post("/match-skills")
async def match_skills_endpoint(request: MatchRequest, api_key: str = Depends(get_api_key)):
    try:
        gap_analysis = matcher.compute_skill_gap(request.candidate_skills, request.job_skills_str)
        # Calculate a simple score based on matched count vs total required
        score = 0
        if gap_analysis['total_required'] > 0:
            score = (gap_analysis['matched_count'] / gap_analysis['total_required']) * 100
        
        return {
            "success": True,
            "data": {
                "ai_score": round(score, 2),
                "missing_skills": gap_analysis['missing'],
                "matched_skills": gap_analysis['matched']
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))