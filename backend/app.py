import os
import logging_
from loguru import logger
from typing import List
from fastapi import FastAPI
from db.data_models import Target
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

logger.debug(".env has succesfully loaded")

from db import handlers

@app.get("/user/{owner_login}/targets")
async def get_all_targets(owner_login: str) -> List[Target]:
    return handlers.get_all_targets(owner_login)

