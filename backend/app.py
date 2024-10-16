from loguru import logger
import json
import myway_exceptions as my_ex
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
    except my_ex.FetchError as ex:
        raise HTTPException(status_code=500,
                            detail=json.dumps({"message":str(ex)}))


@app.post("/user/{owner_login}/goals")
async def create_goal(owner_login: str, goal: Goal) -> Goal:
    try:
        return handlers.create_goal(owner_login, goal)
    except my_ex.CreateNodeError as ex:
        raise HTTPException(status_code=500,
                            detail=json.dumps({"message": str(ex)}))


@app.get("/user/{user_login}/goal/{goal_id}")
async def get_goal(user_login: str, goal_id: str):
    try:
        return handlers.get_goal_by_id(user_login, goal_id)
    except my_ex.FetchError as ex:
        raise HTTPException(status_code=500,
                            detail=json.dumps({"message":str(ex)}))
    except KeyError as ex:
        raise HTTPException(status_code=404,
                            detail=json.dumps({"message":str(ex)}))
    except IndexError as ex:
        raise HTTPException(status_code=404,
                            detail=json.dumps({"message":
                                               f"""Goal with goal_id: '{goal_id}' not found 
                                                   for user '{user_login}'"""}))

