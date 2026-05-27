from fastapi import APIRouter, status
from ..schemas.chain import Chain, ResponseChain
from ..commands.minimun_cost import minimun_cost_method

router = APIRouter(prefix="/transport")

@router.post("/minimun_cost")
async def minimun_cost(chain: Chain):
    matrix, demands, offers, groq = chain.matrix, chain.demands, chain.offers, chain.groq
    conclusion = ""
    try:   
        mc = minimun_cost_method(matrix,offers,demands)
        mc.resolve_minimun_cost()

        if groq:
            rpt = mc.groq_promt("Costo minimo", chain.balanced)
            conclusion = rpt if rpt is not None else "Error al generar la conclusión con Groq"

        response = ResponseChain(
          statusCode=status.HTTP_200_OK,
          message="Ejercicio resuelto", 
          logs=mc.logs,
          values=mc.values,
          result=mc.result,
          conclusionGroq=conclusion
        ).model_dump()

        return response
    except ValueError as ve:
        response = ResponseChain(
          statusCode=status.HTTP_400_BAD_REQUEST,
          message=ve, 
        ).model_dump()

        return response
