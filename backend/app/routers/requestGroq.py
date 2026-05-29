from fastapi import APIRouter, status, HTTPException
from ..schemas.data import dataAnswer, dataHungarian, dataMessage
from ..commands.request_groq import request_groq

router_groq = APIRouter(prefix="/groq")
    
@router_groq.post("/")
async def methods_operations(groq_message: dataMessage):
    rg = request_groq()
    rpt = rg.groq_promt_method(
        balanced=groq_message.balanced,
        demands=groq_message.demands,
        destinations=groq_message.destinations,
        extraContext=groq_message.extraContext,
        matrix=groq_message.matrix,
        method=groq_message.method,
        offers=groq_message.offers,
        origins=groq_message.origins,
        result=groq_message.result,
        values=groq_message.values,
        log=groq_message.log)
        
    if rpt is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ha habido un error al crear la conclusión con groq")

    response = dataAnswer(
        message="Conclusion terminada",
        conclusionGroq=rpt
    ).model_dump()

    return response

@router_groq.post("/hungarian")
async def methods_hungarian(groq_message: dataHungarian):
    rg = request_groq()
    rpt = rg.groq_promt_hungarian(
        destinations=groq_message.destinations,
        extraContext=groq_message.extraContext,
        matrix=groq_message.matrix,
        origins=groq_message.origins,
        result=groq_message.result,
        positions=groq_message.positions,
        values=groq_message.values,
        log=groq_message.log)
        
    if rpt is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ha habido un error al crear la conclusión con groq")

    response = dataAnswer(
        message="Conclusion terminada",
        conclusionGroq=rpt
    ).model_dump()

    return response