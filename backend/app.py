from loguru import logger
import json
from myway_exceptions import FetchError
from typing import List
from fastapi import FastAPI, HTTPException
from data_models import Goal
from dotenv import load_dotenv
import os 

logger.remove()
log_path = os.path.join(os.getcwd(), "backend/logs.log")
logger.add(log_path)

app = FastAPI()

load_dotenv()

logger.debug(".env has succesfully loaded")

import handlers

@app.get("/user/{owner_login}/goals")
async def get_all_goals(owner_login: str) -> List[Goal]:
    try:
        return handlers.get_all_goals(owner_login)
    except FetchError as ex:
        raise HTTPException(status_code=500,
                            detail=json.dumps({"message":str(ex)}))



