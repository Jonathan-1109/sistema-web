from enum import Enum
from ..utils.validators.errors import check_orgDes
from pydantic import model_validator
from pydantic import BaseModel

class ValidMethods(str, Enum):
    minimum_cost = "costo_minimo"
    nortwest_corner = "esquina_noroeste"
    vogel = "vogel"

class BaseMatrix(BaseModel):
    matrix: list[list[float]]

class Response(BaseModel):
    message: str
    id: str
    log: dict 
    values: list 
    result: float 

class Message(BaseModel):
    origins: str | list[str]
    destinations: str | list[str]
    extraContext: str | None = None

    _check_orgDes = model_validator(mode="after")(check_orgDes)

class AnswerGroq(BaseModel):
    message: str
    conclusionGroq: str | None = None