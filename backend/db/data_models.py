from pydantic import BaseModel
from datetime import date


class Target(BaseModel):
    description: str
    deadline: date

