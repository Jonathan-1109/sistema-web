from pydantic import BaseModel, model_validator
from enum import Enum
from ..utils.errors import check_dimensions, check_matrix_management, check_orgDes

class groqValidMethods(str, Enum):
    minimum_cost = "costo_minimo"
    nortwest_corner = "esquina_noroeste"
    vogel = "vogel"

class groqMessage(BaseModel):
    method: groqValidMethods
    origins: str | list[str]
    destinations: str | list[str]
    extraContext: str | None = None
    matrix: list[list[float]]
    offers: list[float]
    demands: list[float]
    balanced: bool = False
    log: dict
    result: float
    values: list[float]

    _check = model_validator(mode="after")(check_dimensions)
    _check_orgDes = model_validator(mode="after")(check_orgDes)
    
    @model_validator(mode="after")
    def balance(self):
        self.balanced = sum(self.offers) == sum(self.demands)
        return self
    

class groqHungarian(BaseModel):
    origins: str | list[str]
    destinations: str | list[str]
    extraContext: str | None = None
    matrix: list[list[float]]
    log: dict
    result: float
    values: list[float]
    positions: list[list[int]]

    _check = model_validator(mode="after")(check_matrix_management)
    _check_orgDes = model_validator(mode="after")(check_orgDes)


class groqAnswer(BaseModel):
    message: str
    conclusionGroq: str | None = None