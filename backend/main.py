
from fastapi import FastAPI
from simplified_demo import parse_pattern
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow the React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatternRequest(BaseModel):
    instructions: str

@app.get("/")
def root():
    return {"message": "Mosaic Knitting Converter API"}

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/pattern")
def process_pattern(pattern: PatternRequest):
    parsed_result = parse_pattern(pattern.instructions)

    return {
        "success": True,
        "instructions": pattern.instructions,
        "parsed_array": parsed_result["parsed_array"],
        "chart_string": parsed_result["chart_string"]
    }
