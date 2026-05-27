from fastapi import APIRouter, status, HTTPException
from ..schemas.chain import Chain, ResponseChain, ValidMethods
from ..commands.minimun_cost import minimun_cost_method
from ..commands.nortwest_corner import nortwest_corner_method
from ..commands.vogel import vogel_approximation_method

router = APIRouter(prefix="/transport")
    
@router.post("/{method}")
async def methods_operations(method: ValidMethods, chain: Chain):
    matrix, demands, offers, groq = chain.matrix, chain.demands, chain.offers, chain.groq
    conclusion = ""
    methodValue = ""
    mc = None
    try:   
        match method:
            case "costo minimo":
              methodValue = "Costo minimo"
              mc = minimun_cost_method(matrix,offers,demands)
              mc.resolve_minimun_cost()

            case "nortwest corner":
              methodValue = "Esquina noroeste"
              mc = nortwest_corner_method(matrix,offers,demands)
              mc.resolve_nortwest()  

            case "vogel":
              methodValue = "Aproximación de vogel"
              mc = vogel_approximation_method(matrix,offers,demands)
              mc.resolve_vogel()

            case _:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El metodo buscado es invalido")
  
        if groq:
            rpt = mc.groq_promt(methodValue, chain.balanced)
            conclusion = rpt if rpt is not None else "Error al generar la conclusión con Groq"

        response = ResponseChain(
          status_code=status.HTTP_200_OK,
          message="Ejercicio resuelto", 
          logs=mc.logs,
          values=mc.values,
          result=mc.result,
          conclusionGroq=conclusion
        ).model_dump()

        return response
    
    except ValueError as ve:
        response = ResponseChain(
          status_code=status.HTTP_400_BAD_REQUEST,
          message=ve, 
        ).model_dump()

        return response
    
    except HTTPException as he:
       return he
    
  