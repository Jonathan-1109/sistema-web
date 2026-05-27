from pydantic import BaseModel, model_validator
from enum import Enum
from fastapi import HTTPException

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
    result: float
    values: list[float]

    @model_validator(mode="after")
    def check_methods(self):
            
        if (len(self.matrix[0]) != len(self.demands) or len(self.matrix) != len(self.offers)):
            raise HTTPException(status_code=422, detail="El tamaño de la matriz de datos es distinto al tamaño de ofertas o demandas")
    
        if not all(len(fila) == len(self.matrix[0]) for fila in self.matrix):
            raise HTTPException(status_code=422, detail="El tamaño de la matriz es irregular")
            
        self.balanced = sum(self.offers) == sum(self.demands) 
                
        return self
    
class groqAnswer(BaseModel):
    message: str
    conclusionGroq: str | None = None