from pydantic import BaseModel, model_validator
from ..utils.errors import check_matrix_management

class Management(BaseModel):
    matrix: list[list[float]]

    _check = model_validator(mode="after")(check_matrix_management)
    
class ResponseManagement(BaseModel):
    message: str
    log: dict | None = None
    values: list[float] | None = None
    positions: list[list[int]] | None = None
    result: float | None = None
