from loguru import logger
from fastapi.middleware.cors import CORSMiddleware
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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Замените на список доверенных источников
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv()

logger.debug(".env has succesfully loaded")

import handlers

@app.get("/user/{owner_login}/goals")
async def get_all_goals(owner_login: str) -> List[Goal]:
    try:
        return handlers.get_all_goals(owner_login)
    except my_ex.FetchError as ex:
        raise HTTPException(status_code=500,
                            detail=str(ex))
    except my_ex.UserCreationError as ex:
        raise HTTPException(status_code=500,
                            detail=str(ex))



@app.post("/user/{owner_login}/goals")
async def create_goal(owner_login: str, goal: Goal) -> Goal:
    try:
        return handlers.create_goal(owner_login, goal)
    except my_ex.CreateNodeError as ex:
        raise HTTPException(status_code=500,
                            detail=str(ex))


@app.get("/user/{user_login}/goal/{goal_id}")
async def get_goal(user_login: str, goal_id: str) -> Goal:
    try:
        return handlers.get_goal_by_id(user_login, goal_id)
    except my_ex.FetchError as ex:
        raise HTTPException(status_code=500,
                            detail=str(ex))
    except my_ex.TransformError as ex:
        raise HTTPException(status_code=500,
                            detail=json.dumps({"message":
                                               """Records was fetched but cannot transformed into the Goal class"""})) 
    except KeyError as ex:
        raise HTTPException(status_code=404,
                            detail=str(ex))
    except IndexError as ex:
        raise HTTPException(status_code=404,
                            detail=json.dumps({"message":
                            f"""Goal with goal_id: '{goal_id}' not found for user '{user_login}'"""}))


@app.put("/user/{user_login}/goal/{goal_id}")
async def edit_goal(user_login: str,
                    goal_id: str,
                    goal: Goal) -> Goal:
    try:
        return handlers.edit_goal(user_login, goal_id, goal)
    except my_ex.FetchError as ex:
        raise HTTPException(status_code=500,
                            detail=str(ex))


@app.delete("/user/{user_login}/goal/{goal_id}")
async def delete_goal(user_login: str, 
                      goal_id: str):
    try:
        handlers.delete_goal(user_login, goal_id)
        return {"message", "Goal is succesfully deleted"}
    except my_ex.NoSuchGoalError as ex: 
        raise HTTPException(status_code=404,
                            detail=str(ex))
    except my_ex.FetchError as ex:
        raise HTTPException(status_code=500,
                            detail=str(ex))
    except my_ex.QueryError as ex:
        raise HTTPException(status_code=500,
                            detail=str(ex))
