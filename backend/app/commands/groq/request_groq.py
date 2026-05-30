import os
from groq import Groq
from ...utils.groq_conclusion import groq_conclusion

class request_groq:
    def __init__(self):
        groqKey = os.getenv("GROQ_API_KEY", "")
        self.client = Groq(api_key=groqKey)

    def _method_name(self, method: str) -> str:
        match method:
            case "costo_minimo":
                return "Costo minimo"
            case "esquina_noroeste":
                return "Esquina noroeste"
            case "vogel":
                return "Aproximación de vogel"
            case "hungaro":
                return "Método húngaro"
            case _:
                return method.capitalize()

    def groq_prompt(
        self, 
        method: str,
        origins: str | list[str],
        destinations: str | list[str],
        matrix: list[list[float]],
        result: float,
        values: list[float],
        log: dict,
        extraContext: str | None = None,
        balanced: bool | None = None,
        offers: list[float] | None = None,
        demands: list[float] | None = None,
        positions: list[list[int]] | None = None
    ) -> str | None:

        method_value = self._method_name(method)
        is_hungarian = method == "hungaro"

        datos_problema = f"""DATOS DEL PROBLEMA:
        - Método utilizado: {method_value}
        - Matriz de costos (columnas={destinations}, filas={origins}): {matrix}"""

        if not is_hungarian:
            str_offers = ", ".join(str(v) for v in offers) if offers else ""
            str_demands = ", ".join(str(v) for v in demands) if demands else ""
            is_balanced = "si" if balanced else "No (se agregó variable ficticia con costo 0)"
            
            datos_problema += f"""
            - Ofertas por origen: {str_offers}
            - Demandas por destino: {str_demands}
            - Problema balanceado: {is_balanced}"""

        datos_problema += f"\n    - Solución paso a paso: {log}"

        if is_hungarian:
            explicacion_valores = "El resultado es la suma de todos los valores"
            str_positions = f"\n    - Posiciones de los valores en la matriz original: {positions}"
        else:
            explicacion_valores = f"valor minimo de la oferta y demanda * valor minimo por el metodo de {method_value}"
            str_positions = ""

        resultado_obtenido = f"""RESULTADO OBTENIDO: {result}
        - Valores para obtener el resultado ({explicacion_valores}): {values}{str_positions}"""

        contexto_adicional = f"\n    Informacion adicional: {extraContext}" if extraContext else ""

        user_content = f"""Analiza el siguiente problema de {'asignación' if is_hungarian else 'transporte'} resuelto por el metodo de {method_value} y 
        proporciona una conclusión académica prestigiosa y estructurada.
        
        {datos_problema}

        {resultado_obtenido}

        Por favor, estructura tu respuesta con estas secciones (máximo 300 palabras en total):
        1. **Resumen del procedimiento**: Describe brevemente cómo funciona el {method_value} y cómo se aplicó.
        2. **Interpretación del resultado**: Explica qué significa el resultado de {result} en el contexto del problema.
        3. **Calidad de la solución**: Indica si esta es una solución óptima o una solución factible inicial (básica).
        4. **Analisis**: Cuellos de botella, riesgos logísticos y balances de carga de trabajo según los valores.{contexto_adicional}"""

        return groq_conclusion(self.client, user_content)