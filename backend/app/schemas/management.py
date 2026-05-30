from pydantic import model_validator
from .base import BaseMatrix, Response
from ..utils.validators.errors import check_matrix_management
from ..utils.validators.verify import balance_assignment

class Management(BaseMatrix):
    _check = model_validator(mode="after")(check_matrix_management)
    _check_balance = model_validator(mode="after")(balance_assignment)

class ResponseManagement(Response):
    positions: list[list[int]]
