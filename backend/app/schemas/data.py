from pydantic import model_validator
from ..utils.validators.errors import check_dimensions, check_matrix_management, check_orgDes
from .base import Message

class dataMessage(Message):
    offers: list[float]
    demands: list[float]
    balanced: bool = False

    _check = model_validator(mode="after")(check_dimensions)
    _check_orgDes = model_validator(mode="after")(check_orgDes)
    
class dataHungarian(Message):
    positions: list[list[int]]

    _check = model_validator(mode="after")(check_matrix_management)
    _check_orgDes = model_validator(mode="after")(check_orgDes)

class dataPDF(dataMessage):
    conclusion: str | None = None

class dataHungarianPDF(dataHungarian):
    conclusion: str | None = None
