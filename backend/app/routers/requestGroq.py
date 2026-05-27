from fastapi import APIRouter, status, HTTPException
from ..schemas.groqData import groqAnswer, groqMessage
from ..commands.request_groq import request_groq

router_groq = APIRouter(prefix="/groq")
    
@router_groq.post("/")
async def methods_operations(groq_message: groqMessage):
    rg = request_groq()
    rpt = rg.groq_promt(
        balanced=groq_message.balanced,
        demands=groq_message.demands,
        destinations=groq_message.destinations,
        extraContext=groq_message.extraContext,
        matrix=groq_message.matrix,
        method=groq_message.method,
        offers=groq_message.offers,
        origins=groq_message.origins,
        result=groq_message.result,
        values=groq_message.values)
        
    if rpt is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ha habido un error al crear la conclusión con groq")

    response = groqAnswer(
        message="Conclusion terminada",
        conclusionGroq=rpt
    ).model_dump()

    return response