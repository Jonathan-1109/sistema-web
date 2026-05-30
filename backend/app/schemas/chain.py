from pydantic import model_validator
from ..utils.validators.errors import check_dimensions
from ..utils.validators.verify import balance_transport
from .base import BaseMatrix, Response

class Chain(BaseMatrix):
    offers: list[float]
    demands: list[float]
    balanced: bool = False

    _check = model_validator(mode="after")(check_dimensions)
    _check_balance = model_validator(mode="after")(balance_transport)

class ResponseChain(Response):
    balanced: bool 