import os
from groq import Groq
from ..utils.groq_conclusion import groq_conclusion

class request_groq:
    def __init__(self):
        groqKey = os.getenv("GROQ_API_KEY", "")
        self.client = Groq(api_key=groqKey)

    def _method_name(self, method: str):
        match method:
            case "costo_minimo":
                return "Costo minimo"
            case "esquina_noroeste":
                return "Esquina noroeste"
            case "vogel":
                return "Aproximación de vogel"
            case _:
                return ""

    def groq_promt_method(self, 
    method: str,
    origins: str | list[str],
    destinations: str | list[str],
    matrix: list[list[float]],
    balanced: bool,
    result: float,
    offers: list[float],
    demands: list[float],
    values: list[float],
    log: dict,
    extraContext: str | None
    ) -> str | None:

        methodValue = self._method_name(method)
        user_content = f"""Analiza el siguiente problema de transporte resuelto por el metodo de {methodValue} y proporciona una conclusión académica estructurada.
        
        DATOS DEL PROBLEMA:
        - Método utilizado: {methodValue}
        - Matriz de costos (columnas={destinations}, filas={origins}): {matrix}
        - Ofertas por origen: {", ".join(str(v) for v in offers)}
        - Demandas por destino:  {", ".join(str(v) for v in demands)}
        - Problema balanceado: {"si" if balanced else "No (se agregó variable ficticia con costo 0)"}
        - Solución paso a paso: {log}

        RESULTADO OBTENIDO: {result}
        - Valores para obtener el resultado (valor minimo de la oferta y demanda * valor minimo por el metodo de {methodValue}): {values}

        Por favor, estructura tu respuesta con estas secciones (máximo 300 palabras en total):
        1. **Resumen del procedimiento**: Describe brevemente cómo funciona el Método de {methodValue} y cómo se aplicó.
        2. **Interpretación del resultado**: Explica qué significa el costo total de {result} en el contexto del problema.
        3. **Calidad de la solución**: Indica si esta es una solución óptima o una solución factible inicial (básica).
        4. **Analisis**: Cuellos de botella, riesgos logísticos y balances de carga de trabajo según los valores"""
        {"Informacion adicional: " + extraContext if extraContext is not None else ""}

        conclusion = groq_conclusion(self.client, user_content)

        return conclusion
    
    def groq_promt_hungarian(self, 
    origins: str | list[str],
    destinations: str | list[str],
    matrix: list[list[float]],
    result: float,
    values: list[float],
    positions: list[list[int]],
    log: dict,
    extraContext: str | None
    ) -> str | None:

        user_content = f"""Analiza el siguiente problema de asignación resuelto por el metodo hungaro y proporciona una conclusión académica estructurada.
        
        DATOS DEL PROBLEMA:
        - Método utilizado: hungaro
        - Matriz de costos (columnas={destinations}, filas={origins}): {matrix}
        - Solución paso a paso: {log}

        RESULTADO OBTENIDO: {result}
        - Valores para obtener el resultado (El resultado es la suma de todos los valores): {values}
        - Posiciones de los valores en la matriz original: {positions}

        Por favor, estructura tu respuesta con estas secciones (máximo 300 palabras en total):
        1. **Resumen del procedimiento**: Describe brevemente cómo funciona el Método hungaro y cómo se aplicó.
        2. **Interpretación del resultado**: Explica qué significa el resultado en el problema de asiganción: {result} en el contexto del problema.
        3. **Calidad de la solución**: Indica si esta es una solución.
        4. **Analisis**: Cuellos de botella, riesgos logísticos y balances de carga de trabajo según los valores"""
        {"Informacion adicional: " + extraContext if extraContext is not None else ""}

        conclusion = groq_conclusion(self.client, user_content)

        return conclusion