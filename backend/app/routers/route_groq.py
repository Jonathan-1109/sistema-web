from fastapi import APIRouter, status, HTTPException, Depends
from redis.asyncio import Redis, RedisError
from ..db.storage import get_redis
from ..utils.validators.verify import deserialize
from ..schemas.base import AnswerGroq, Message
from ..commands.groq.request_groq import rg

router_groq = APIRouter(prefix="/groq")
    
@router_groq.post("/{id}")
async def methods_operations(id: str, message: Message, redis: Redis = Depends(get_redis)):
    
    try:
        operation = await redis.hgetall(id)
        if not operation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ejercicio no encontrado o inexistente")
        dsr = deserialize(operation)

        rpt = rg.groq_prompt(
            destinations=message.destinations,
            extraContext=message.extraContext,
            matrix=dsr.get("matrix"),
            method=dsr.get("method"),
            origins=message.origins,
            result=dsr.get("result"),
            values=dsr.get("values"),
            log=dsr.get("log"),
            balanced=dsr.get("balanced"),
            offers=dsr.get("offers"),
            demands=dsr.get("demands"),
           positions=dsr.get("positions")
        ).replace("*","")
            
        if rpt is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ha habido un error al crear la conclusión con groq")

        await redis.hset(id, mapping={"conclusion":rpt})

        response = AnswerGroq(
            message="Conclusion terminada",
            conclusionGroq=rpt
        ).model_dump()

        return response

    except RedisError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ha habido un error al crear la conclusión con groq: Ejercicio no encontrado")
