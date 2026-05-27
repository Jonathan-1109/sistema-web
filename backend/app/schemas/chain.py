from pydantic import BaseModel, model_validator
from fastapi import HTTPException
from enum import Enum

class ValidMethods(str, Enum):
    minimum_cost = "costo_minimo"
    nortwest_corner = "esquina_noroeste"
    vogel = "vogel"

class Chain(BaseModel):
    matrix: list[list[float]]
    offers: list[float]
    demands: list[float]
    balanced: bool = False

    @model_validator(mode="after")
    def check_dimensions(self):

        if (len(self.matrix[0]) != len(self.demands) or len(self.matrix) != len(self.offers)):
            raise HTTPException(status_code=422, detail="El tamaño de la matriz de datos es distinto al tamaño de ofertas o demandas")
    
        if not all(len(fila) == len(self.matrix[0]) for fila in self.matrix):
            raise HTTPException(status_code=422, detail="El tamaño de la matriz es irregular")
                
        return self

    @model_validator(mode="after")
    def balance(self):
        dem_total = sum(self.demands)
        off_total = sum(self.offers)

        if dem_total > off_total:
            self.offers.append(dem_total-off_total)
            self.matrix.append([0 for i in range(len(self.demands))])

        elif dem_total < off_total:
            self.demands.append(off_total-dem_total)
            for i in range(len(self.offers)):
                self.matrix[i].append(0)

        return self
    
class ResponseChain(BaseModel):
    message: str
    logs: dict | None = None
    values: list | None = None
    result: int | None = None
