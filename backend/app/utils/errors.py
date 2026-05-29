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
        
        if len(self.matrix) != len(self.matrix[0]):
            raise HTTPException(status_code=422, detail="La matriz no es cuadrada")
                
        return self

def check_orgDes(cls, self):
        if type(self.origins) == list and len(self.origins) != len(self.matrix):
            raise HTTPException(status_code=422, detail="La cantidad de origenes no coindice con la matriz de datos")     
        
        if type(self.destinations) == list and len(self.destinations) != len(self.matrix[0]):
            raise HTTPException(status_code=422, detail="La cantidad de destinos no coindice con la matriz de datos")     
        
        return self