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
        