from pydantic import BaseModel, model_validator

class Management(BaseModel):
    matrix: list[list[float]]
    groq: bool = False