from loguru import logger
from neo4j import GraphDatabase, Record
from db.data_models import Target
from typing import List, Dict
from datetime import date, datetime
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


def dictToTarget(dictObj: Dict) -> Target:
    logger.debug(dictObj)
    date_ = str(dictObj.get("deadline"))
    deadline = datetime.strptime(date_, "%Y-%m-%d").date()
    return Target(description=str(dictObj.get("description")),
                  deadline=deadline)


def get_all_targets() -> List[Target]:
    try:        
        logger.debug("Executing query to fetch all targets")
        records, summary, keys = driver.execute_query("MATCH (t:Target) RETURN t", database_="myway") 
        logger.info(f"Query successful, fetched {len(records)} records")
        logger.debug(f"Record in records are of type {type(records[0])}")
        return [dictToTarget(r.data().get("t")) for r in records]
    except Exception as ex:
        logger.error(f"Error occurred while fetching targets: {ex}")
        raise RuntimeError("Failed to fetch targets") from ex  # Создаем пользовательское исключение для API

