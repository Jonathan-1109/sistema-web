from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import StreamingResponse
from redis.asyncio import Redis, RedisError
from ..db.storage import get_redis
from ..utils.validators.verify import deserialize

from ..utils.createPDF import create_pdf

router_pdf = APIRouter(prefix="/pdf")

@router_pdf.get("/{id}")
async def generate_pdf(id: str, redis: Redis = Depends(get_redis)):
    try:
        operation = await redis.hgetall(id)
        if not operation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ejercicio no encontrado o inexistente")
        
        dsr = deserialize(operation)

        cond = dsr.get("method") == "hungaro"

        template = "hungarianTemplate.html" if cond else "transportTemplate.html"
        name = "Asignación" if cond else "Transporte"

        pdf_bytes, name = create_pdf(dsr,template,name)

        return StreamingResponse(
            pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={name}"}
        )
    except RedisError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ejercicio no encontrado",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al generar el PDF",
        )
