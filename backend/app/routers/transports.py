from fastapi import APIRouter, status, HTTPException
from ..schemas.chain import Chain, ResponseChain, ValidMethods
from ..commands.minimun_cost import minimun_cost_method
from ..commands.nortwest_corner import nortwest_corner_method
from ..commands.vogel import vogel_approximation_method

router = APIRouter(prefix="/transport")
    
@router.post("/{method}")
async def methods_operations(method: ValidMethods, chain: Chain):
    matrix, demands, offers = chain.matrix, chain.demands, chain.offers
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
  
        response = ResponseChain(
          message="Ejercicio resuelto", 
          logs=mc.logs,
          values=mc.values,
          result=mc.result,
        ).model_dump()

        return response
    
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ha habido un error en el servidor al realizar la operación")

