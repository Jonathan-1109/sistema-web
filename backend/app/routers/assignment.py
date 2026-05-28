from fastapi import APIRouter, status, HTTPException
from ..schemas.management import Management, ResponseManagement
from ..commands.hungarian import hungarian_method

router_ass = APIRouter(prefix="/assignment")
    
@router_ass.post("/")
async def hungarian(mng: Management):
    matrix = mng.matrix
    try:   
        mc = hungarian_method(matrix)
        mc.resolve_hungarian()
        response = ResponseManagement(
          message="Ejercicio resuelto", 
          logs=mc.logs,
        ).model_dump()

        return response
    
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ha habido un error en el servidor al realizar la operación")

