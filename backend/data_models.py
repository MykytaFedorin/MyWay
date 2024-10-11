from pydantic import BaseModel
from datetime import date


class Goal(BaseModel):
    description: str
    deadline: date
    owner_login: str

