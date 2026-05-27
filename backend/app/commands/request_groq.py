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
    extraContext: str | None,
    offers: list[float] | None,
    demands: list[float] | None) -> str | None:

        user_content = f"""Analiza el siguiente problema de transporte resuelto por el metodo de {method} y proporciona una conclusión académica estructurada.

        DATOS DEL PROBLEMA:
        - Método utilizado: {method}
        - Matriz de costos (filas={origins}, columnas={destinations}): {matrix}
        {"- Ofertas por origen: " + ", ".join(str(v) for v in offers) if method != "Hungaro" else ""}
        {"- Demandas por destino: " + ", ".join(str(v) for v in demands) if method != "Hungaro" else ""}
        {("- Problema balanceado: " + "si" if balanced else "No (se agregó variable ficticia con costo 0)") if method != "Hungaro" else ""}

        RESULTADO OBTENIDO: {result}

        Por favor, estructura tu respuesta con estas secciones (máximo 200 palabras en total):
        1. **Resumen del procedimiento**: Describe brevemente cómo funciona el Método de {method} y cómo se aplicó.
        2. **Interpretación del resultado**: Explica qué significa el costo total de {result} en el contexto del problema.
        3. **Calidad de la solución**: Indica si esta es una solución óptima o una solución factible inicial (básica)."""

        {"Informacion adicional: " + extraContext if extraContext is not None else ""}

        conclusion = groq_conclusion(self.client, user_content)

        return conclusion