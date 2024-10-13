from loguru import logger
from neo4j import GraphDatabase
from data_models import Goal
from typing import List, Dict
from datetime import datetime
import myway_exceptions as my_ex
import uuid

import os

URI = str(os.getenv("NEO4J_URL"))
logger.debug(f"URL:{URI}")
AUTH = (str(os.getenv("NEO4J_LOGIN")), str(os.getenv("NEO4J_PASSWORD")))
logger.debug(f"AUTH:{AUTH}")

driver = GraphDatabase.driver(URI, auth=AUTH, database="myway")
try:
    driver.verify_connectivity()
    logger.debug("Succesfully established connection")
except Exception as ex:
    raise ex


def dictToTarget(dictObj: Dict) -> Goal:
    logger.debug(dictObj)
    date_ = str(dictObj.get("deadline"))
    deadline = datetime.strptime(date_, "%Y-%m-%d").date()
    return Goal(goal_id=uuid.UUID(dictObj.get("goal_id")),
                description=str(dictObj.get("description")),
                deadline=deadline,
                owner_login=int(dictObj.get("owner_login")))


def get_all_goals(owner_login: str) -> List[Goal]:
    logger.debug(f"Executing query to fetch all goals for user {owner_login}")
    query = f'MATCH (u:User {{login: "{owner_login}"}})-[:OWNS]->(g:Goal) RETURN g'

    try:        
        records, summary, keys = driver.execute_query(query, database_="myway") 
        logger.info(f"Query successful, fetched {len(records)} records")
    except Exception as ex:
        logger.error(f"Error occurred while fetching goals: {ex}")
        raise my_ex.FetchError("Failed to fetch goals") from ex   
    try:
        return [dictToTarget(r.data().get("g")) for r in records]
    except Exception as ex:
        raise my_ex.TransformError("Fail to transform dict to Goal")


def create_goal(owner_login: str, goal: Goal) -> Goal:
    logger.debug(f"Executing query to create Goal for user {owner_login}")

    query = '''CREATE (g:Goal {goal_id: $goal_id,
                              description: $description,
                              deadline: date($deadline),
                              owner_login: $owner_login})
                WITH g
                MATCH (u:User {login: $owner_login})
                CREATE (u)-[:HAS_GOAL]->(g)'''

    goal_id = str(goal.goal_id or uuid.uuid1())
    parameters = {
        "goal_id": goal_id,
        "description": goal.description,
        "deadline": goal.deadline.isoformat(),  # Строка в формате YYYY-MM-DD
        "owner_login": owner_login
    }

    logger.debug(f"Query: {query}")
    logger.debug(f"Parameters: {parameters}")

    try:
        with driver.session() as session:
            result = session.run(query, parameters)
            summary = result.consume()
            logger.debug(f"Query summary: {summary}")
            counters = summary.counters
            logger.debug(f"Nodes created: {counters.nodes_created}")
            if counters.nodes_created == 0:
                logger.warning("No nodes were created in the database.")
            logger.debug(f"Relationships created: {counters.relationships_created}")
            logger.debug(f"Properties set: {counters.properties_set}")
            logger.debug(f"Successfully created Goal for user {owner_login}")

        return Goal(
            goal_id=uuid.UUID(goal_id),  # Преобразуем обратно в UUID
            description=goal.description,
            deadline=goal.deadline,
            owner_login=goal.owner_login
        )
    except Exception as ex:
        logger.error(f"Failed to create Goal for user {owner_login}: {ex}")
        raise my_ex.CreateNodeError(f"Fail to create node of type Goal by user {owner_login}") from ex

