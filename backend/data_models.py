from pydantic import BaseModel
from datetime import date
import uuid 


class Goal(BaseModel):
    goal_id: uuid.UUID | None = None
    description: str
    deadline: date
    owner_login: str

