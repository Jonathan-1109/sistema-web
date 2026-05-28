from pydantic import BaseModel, model_validator
from fastapi import HTTPException

class Management(BaseModel):
    matrix: list[list[float]]

    @model_validator(mode="after")
    def check_matrix(self):
        if len(self.matrix) != len(self.matrix[0]):
            raise HTTPException(status_code=422, detail="La matriz tiene que tener la misma cantidad de filas y columnas (MxM)")
        
        if not all(len(fila) == len(self.matrix[0]) for fila in self.matrix):
            raise HTTPException(status_code=422, detail="El tamaño de la matriz es irregular")
                
        return self
    
class ResponseManagement(BaseModel):
    message: str
    logs: dict | None = None
