from pydantic import BaseModel, model_validator
from enum import Enum
from fastapi import HTTPException

class groqValidMethods(str, Enum):
    minimum_cost = "costo_minimo"
    nortwest_corner = "esquina_noroeste"
    vogel = "vogel"
    hungaro = "hungaro"

class groqMessage(BaseModel):
    method: groqValidMethods
    methodUsed: str | None = None
    origins: str | list[str]
    destinations: str | list[str]
    extraContext: str | None = None
    matrix: list[list[float]]
    offers: list[float] | None = None
    demands: list[float] | None = None
    balanced: bool | None = None
    result: float

    @model_validator(mode="after")
    def check_methods(self):

        match self.method:
            case "costo_minimo":
              self.methodUsed = "Costo minimo"

            case "esquina_noroeste":
              self.methodUsed = "Esquina noroeste"

            case "vogel":
              self.methodUsed = "Aproximación de vogel"
            
            case _:
              self.methodUsed = "Hungaro"

        if (self.methodUsed == "Hungaro"):
            self.offers = None
            self.demands = None
            self.balanced = None

        else:
            if (self.offers is None or self.demands is None):
                raise HTTPException(status_code=422, detail={"El metodo utilizado no tiene ofertas o demandas"})
            
            if (len(self.matrix[0]) != len(self.demands) or len(self.matrix) != len(self.offers)):
                raise HTTPException(status_code=422, detail="El tamaño de la matriz de datos es distinto al tamaño de ofertas o demandas")
    
            if not all(len(fila) == len(self.matrix[0]) for fila in self.matrix):
                raise HTTPException(status_code=422, detail="El tamaño de la matriz es irregular")
            
            self.balanced = sum(self.offers) == sum(self.demands) 
                
        return self
    
class groqAnswer(BaseModel):
    message: str
    conclusionGroq: str | None = None