from fastapi import APIRouter, status, HTTPException, Depends
from redis.asyncio import Redis
from ..db.storage import get_redis
from ..utils.validators.verify import serialize
from uuid import uuid4

from fastapi import APIRouter, status, HTTPException
from ..schemas.management import Management, ResponseManagement
from ..commands.hungarian.hungarian import hungarian_method

router_agm = APIRouter(prefix="/assignment")
    
@router_agm.post("/")
async def hungarian(mng: Management, redis: Redis = Depends(get_redis)):
    matrix = mng.matrix
    try:   
        mc = hungarian_method(matrix)
        mc.resolve_hungarian()

        id = str(uuid4())
        values_to_send = {
          "method": "hungaro",
          "matrix": mc.clone, 
          "positions": mc.pos,
          "log": mc.log, 
          "values": mc.values, 
          "result": mc.result
        }
        sr = serialize(values_to_send)

        await redis.hset(id, mapping=sr)
        await redis.expire(id, 3600)
        response = ResponseManagement(
          message="Ejercicio resuelto", 
          id=id,
          **values_to_send
        ).model_dump()

        print(response)

        return response
    
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ha habido un error en el servidor al realizar la operación")

