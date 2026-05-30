from enum import Enum
from pydantic import BaseModel

class ValidMethods(str, Enum):
    minimum_cost = "costo_minimo"
    nortwest_corner = "esquina_noroeste"
    vogel = "vogel"
    hungarian = "hungaro"

class BaseMatrix(BaseModel):
    matrix: list[list[float]]

class Response(BaseModel):
    message: str
    log: dict 
    values: list 
    result: float 

class Message(BaseModel):
    origins: str | list[str]
    destinations: str | list[str]
    extraContext: str | None = None
    matrix: list[list[float]]
    log: dict
    result: float
    values: list[float]

class AnswerGroq(BaseModel):
    message: str
    conclusionGroq: str | None = None