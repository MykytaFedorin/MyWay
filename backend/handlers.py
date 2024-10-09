from loguru import logger
from neo4j import GraphDatabase
from data_models import Goal
from typing import List, Dict
from datetime import datetime
from myway_exceptions import FetchError, TransformError

import os

URI = str(os.getenv("NEO4J_URL"))
logger.debug(f"URL:{URI}")
AUTH = (str(os.getenv("NEO4J_LOGIN")), str(os.getenv("NEO4J_PASSWORD")))
logger.debug(f"AUTH:{AUTH}")

driver = GraphDatabase.driver(URI, auth=AUTH)
try:
    driver.verify_connectivity()
    logger.debug("Succesfully established connection")
except Exception as ex:
    raise ex


def dictToTarget(dictObj: Dict) -> Goal:
    logger.debug(dictObj)
    date_ = str(dictObj.get("deadline"))
    deadline = datetime.strptime(date_, "%Y-%m-%d").date()
    return Goal(description=str(dictObj.get("description")),
                  deadline=deadline,
                  owner_id=int(dictObj.get("owner_id")))


def get_all_goals(owner_login: str) -> List[Goal]:
    logger.debug(f"Executing query to fetch all goals for user {owner_login}")
    query = f'MATCH (u:User {{login: "{owner_login}"}})-[:OWNS]->(g:Goal) RETURN g'

    try:        
        records, summary, keys = driver.execute_query(query, database_="myway") 
        logger.info(f"Query successful, fetched {len(records)} records")
    except Exception as ex:
        logger.error(f"Error occurred while fetching goals: {ex}")
        raise FetchError("Failed to fetch goals") from ex   
    try:
        return [dictToTarget(r.data().get("g")) for r in records]
    except Exception as ex:
        raise TransformError("Fail to transform dict to Goal")

