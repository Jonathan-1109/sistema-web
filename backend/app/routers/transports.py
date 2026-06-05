from fastapi import APIRouter, status, HTTPException, Depends
from redis.asyncio import Redis
from ..db.storage import get_redis
from uuid import uuid4
from ..utils.validators.verify import serialize, get_name

from ..schemas.chain import Chain, ResponseChain
from ..schemas.base import ValidMethods
from ..commands.transport.minimun_cost import minimun_cost_method
from ..commands.transport.nortwest_corner import nortwest_corner_method
from ..commands.transport.vogel import vogel_approximation_method

router = APIRouter(prefix="/transport")
    
@router.post("/{method}")
async def methods_operations(method: ValidMethods, chain: Chain, redis: Redis = Depends(get_redis)):
    matrix, demands, offers, balanced = chain.matrix, chain.demands, chain.offers, chain.balanced
    mc = None

    try:   
        match method:
            case "costo_minimo":
              mc = minimun_cost_method(matrix,offers,demands)
              mc.resolve_minimun_cost()

            case "esquina_noroeste":
              mc = nortwest_corner_method(matrix,offers,demands)
              mc.resolve_nortwest()  

            case "vogel":
              mc = vogel_approximation_method(matrix,offers,demands)
              mc.resolve_vogel()

            case _:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El metodo buscado es invalido")

        id = str(uuid4())

        values_to_send = {
          "method": get_name(method.value), 
          "matrix": mc.clone_matrix, 
          "balanced": balanced, 
          "offers": mc.clone_offers, 
          "demands": mc.clone_demands,
          "log": mc.log, 
          "values": mc.values, 
          "result": mc.result
        }
        
        sr = serialize(values_to_send)

        await redis.hset(id, mapping=sr)
        await redis.expire(id, 3600)

        response = ResponseChain(
          message="Ejercicio resuelto", 
          id=id,
          **values_to_send
        ).model_dump()

        return response
    
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ha habido un error en el servidor al realizar la operación")