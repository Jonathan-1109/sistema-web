from fastapi import HTTPException

def check_dimensions(cls, self):

    if not all(len(fila) == len(self.matrix[0]) for fila in self.matrix):
        raise HTTPException(status_code=422, detail="El tamaño de la matriz es irregular")
            
    if (len(self.matrix[0]) != len(self.demands) or len(self.matrix) != len(self.offers)):
        raise HTTPException(status_code=422, detail="El tamaño de la matriz de datos es distinto al tamaño de ofertas o demandas")
                
    return self

def check_matrix_management(cls,self):
        if not all(len(fila) == len(self.matrix[0]) for fila in self.matrix):
            raise HTTPException(status_code=422, detail="El tamaño de la matriz es irregular")
        
        return self