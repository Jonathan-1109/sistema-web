import os
from groq import Groq
from ..utils.groq_conclusion import groq_conclusion

class transport:

    def __init__(self, matrix, offers, demands):
        groqKey = os.getenv("GROQ_API_KEY", "")
        self.client = Groq(api_key=groqKey)

        self.matrix = matrix
        self.offers = offers
        self.demands = demands
        self.clone_matrix = [fila[:] for fila in matrix]
        self.clone_offers = offers[:]
        self.clone_demands = demands[:]

        self.values = []
        self.result = 0
        self.logs = {}

    def save_matrix(self, value_of_dem: float, value: float, x: int, y: int, n: int) -> None :

        key = f"iter{n + 1}"
        newDict = {
            key:{"matrix": [fila[:] for fila in self.matrix], 
                "demands": self.demands[:], "offers": self.offers[:], 
                "minimun":value, "offerDemand":value_of_dem, 
                "x":x, "y":y}
            }
        self.logs.update(newDict)
        

    def groq_promt(self, method: str, balanced: bool) -> str | None:

        asignaciones_str = ", ".join(str(v) for v in self.values)

        user_content = f"""Analiza el siguiente problema de transporte resuelto por el metodo de {method} y proporciona una conclusión académica estructurada.

        DATOS DEL PROBLEMA:
        - Método utilizado: {method}
        - Matriz de costos (filas=orígenes, columnas=destinos): {self.clone_matrix}
        - Ofertas por origen: {self.clone_offers}
        - Demandas por destino: {self.clone_demands}
        - Problema balanceado: {'Sí' if balanced else 'No (se agregó variable ficticia con costo 0)'}
        - Número de iteraciones realizadas: {len(self.values)}

        RESULTADO OBTENIDO:
        - Valores de asignación individuales (unidades × costo unitario): [{asignaciones_str}]
        - Costo total mínimo: {self.result}

        Por favor, estructura tu respuesta con estas secciones (máximo 200 palabras en total):
        1. **Resumen del procedimiento**: Describe brevemente cómo funciona el Método de {method} y cómo se aplicó.
        2. **Interpretación del resultado**: Explica qué significa el costo total de {self.result} en el contexto del problema.
        3. **Calidad de la solución**: Indica si esta es una solución óptima o una solución factible inicial (básica).
        4. **Observaciones adicionales**: Menciona si el problema estaba balanceado y cualquier aspecto relevante."""

        conclusion = groq_conclusion(self.client, user_content)

        return conclusion
