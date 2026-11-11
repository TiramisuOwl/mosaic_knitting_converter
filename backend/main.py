from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from input_validation import input_validation
from simplified_demo import parse_pattern

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
    # First, validate the knitting instructions
    input_validator = input_validation(pattern.instructions)

    try:
        validated_instructions = input_validator.validate()
    except ValueError as e:
        return {
            "success": False,
            "instructions": str(e)
        }

    # Then, parse the validated instructions
    parsed_result = parse_pattern(validated_instructions)

    return {
        "success": True,
        "instructions": validated_instructions,
        "parsed_array": parsed_result["parsed_array"],
        "chart_string": parsed_result["chart_string"]
    }

