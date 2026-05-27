import os
from groq import Groq
from ..utils.groq_conclusion import groq_conclusion

class request_groq:
    def __init__(self):
        groqKey = os.getenv("GROQ_API_KEY", "")
        self.client = Groq(api_key=groqKey)

    def groq_promt(self, method: str,
    origins: str | list[str],
    destinations: str | list[str],
    matrix: list[list[float]],
    balanced: bool,
    result: float,
    offers: list[float],
    demands: list[float],
    values: list[float],
    extraContext: str | None
    ) -> str | None:

        user_content = f"""Analiza el siguiente problema de transporte resuelto por el metodo de {method.value} y proporciona una conclusión académica estructurada.

        DATOS DEL PROBLEMA:
        - Método utilizado: {method.value}
        - Matriz de costos (filas={destinations}, columnas={origins}): {matrix}
        - Ofertas por origen: {", ".join(str(v) for v in offers)}
        - Demandas por destino:  {", ".join(str(v) for v in demands)}
        - Problema balanceado: {"si" if balanced else "No (se agregó variable ficticia con costo 0)"}

        RESULTADO OBTENIDO: {result}
        - Valores para obtener el resultado: {values}

        Por favor, estructura tu respuesta con estas secciones (máximo 250 palabras en total):
        1. **Resumen del procedimiento**: Describe brevemente cómo funciona el Método de {method.value} y cómo se aplicó.
        2. **Interpretación del resultado**: Explica qué significa el costo total de {result} en el contexto del problema.
        3. **Calidad de la solución**: Indica si esta es una solución óptima o una solución factible inicial (básica).
        4. **Observaciones adicionales**: Menciona si el problema estaba balanceado y cualquier aspecto relevante."""
        {"Informacion adicional: " + extraContext if extraContext is not None else ""}

        conclusion = groq_conclusion(self.client, user_content)

        return conclusion