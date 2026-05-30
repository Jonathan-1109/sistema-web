from fastapi import APIRouter, status, HTTPException
from ..schemas.data import  dataHungarian, dataMessage
from ..schemas.base import AnswerGroq, ValidMethods
from ..commands.groq.request_groq import request_groq

router_groq = APIRouter(prefix="/groq")
    
@router_groq.post("/{methodUsed}")
async def methods_operations(methodUsed: ValidMethods, groq_message: dataMessage | dataHungarian):
    rg = request_groq()
    rpt = rg.groq_prompt(
        destinations=groq_message.destinations,
        extraContext=groq_message.extraContext,
        matrix=groq_message.matrix,
        method=methodUsed,
        origins=groq_message.origins,
        result=groq_message.result,
        values=groq_message.values,
        log=groq_message.log,
        balanced=getattr(groq_message, "balanced", None),
        offers=getattr(groq_message, "offers", None),
        demands=getattr(groq_message, "demands", None),
        positions=getattr(groq_message, "positions", None))
        
    if rpt is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ha habido un error al crear la conclusión con groq")

    response = AnswerGroq(
        message="Conclusion terminada",
        conclusionGroq=rpt
    ).model_dump()

    return response
