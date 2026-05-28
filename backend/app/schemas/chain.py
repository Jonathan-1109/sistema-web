from pydantic import BaseModel, model_validator
from ..utils.errors import check_dimensions
from enum import Enum

class ValidMethods(str, Enum):
    minimum_cost = "costo_minimo"
    nortwest_corner = "esquina_noroeste"
    vogel = "vogel"

class Chain(BaseModel):
    matrix: list[list[float]]
    offers: list[float]
    demands: list[float]
    balanced: bool = False

    _check = model_validator(mode="after")(check_dimensions)

    @model_validator(mode="after")
    def balance(self):
        dem_total = sum(self.demands)
        off_total = sum(self.offers)
        self.balanced = dem_total == off_total

        if dem_total > off_total:
            self.offers.append(dem_total-off_total)
            self.matrix.append([0 for i in range(len(self.demands))])

        elif dem_total < off_total:
            self.demands.append(off_total-dem_total)
            for i in range(len(self.offers)):
                self.matrix[i].append(0)

        return self
    
class ResponseChain(BaseModel):
    message: str
    log: dict | None = None
    values: list | None = None
    result: int | None = None
    balanced: bool | None = None
