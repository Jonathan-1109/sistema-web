from fastapi import APIRouter, status, HTTPException
from ..schemas.management import Management, ResponseManagement
from ..commands.hungarian.hungarian import hungarian_method

router_agm = APIRouter(prefix="/assignment")
    
@router_agm.post("/")
async def hungarian(mng: Management):
    matrix = mng.matrix
    try:   
        mc = hungarian_method(matrix)
        mc.resolve_hungarian()
        response = ResponseManagement(
          message="Ejercicio resuelto", 
          log=mc.log,
          values=mc.values, 
          positions=mc.pos, 
          result=mc.result
        ).model_dump()

        return response
    
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ha habido un error en el servidor al realizar la operación")

