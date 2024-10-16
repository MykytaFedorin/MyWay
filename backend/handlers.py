from loguru import logger
from neo4j import GraphDatabase
from neo4j import exceptions as neo4j_ex
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
    logger.debug("Start to transform dictObject to a Goal class")
    logger.debug(f"Transformated dictObject: {dictObj}")
    try:
        date_ = str(dictObj.get("deadline"))
        deadline = datetime.strptime(date_, "%Y-%m-%d").date()
        goal = Goal(goal_id=uuid.UUID(dictObj.get("goal_id")),
                    description=str(dictObj.get("description")),
                    deadline=deadline,
                    owner_login=str(dictObj.get("owner_login")))
    except KeyError as ex:
        raise my_ex.TransformError(str(ex))
    return goal


def get_all_goals(owner_login: str) -> List[Goal]:
    logger.debug(f"Executing query to fetch all goals for user {owner_login}")
    query = f'MATCH (u:User {{login: "{owner_login}"}})-[:HAS_GOAL]->(g:Goal) RETURN g'

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


def get_goal_by_id(user_login: str, goal_id: str) -> Goal:
    logger.debug(f"Start to retrieve goal with goal_id:'{goal_id}' for user:'{user_login}'")
    query = f'MATCH (u:User {{login: "{user_login}"}})-[:HAS_GOAL]->(g:Goal {{goal_id: "{goal_id}"}}) RETURN g'
    logger.debug(f"Query: {query}")
    parameters = {
                "goal_id": goal_id,
                "user_login": user_login
                }
    logger.debug(f"Parameters '{parameters}'")
    with driver.session() as session:
        try:
            result = session.run(query, parameters)
            logger.debug("Succesfully started neo4j session")
        except neo4j_ex.SessionError as ex:
            raise my_ex.FetchError("Session error") from ex
        try:
            records = result.fetch(1)
            logger.debug("Succesfully fetched records for goal_id:'{goal_id}'")
        except neo4j_ex.ResultConsumedError as ex:
            raise my_ex.FetchError() from ex
        logger.debug(f"Result of quering: '{records}'")
    try:
        req_record = records[0].data().get("g")
    except KeyError as ex:
        logger.debug(str(ex))
        raise ex
    except IndexError as ex:
        logger.debug(str(ex))
        raise ex
    try:
        req_goal = dictToTarget(req_record)
    except my_ex.TransformError as ex:
        raise ex
    logger.debug("Succesfully retrieve goal with goal_id:'{goal_id}' for user '{}'")
    return req_goal 


def edit_goal(user_id: str,
              goal_id: str,
              goal: Goal) -> Goal:
    logger.debug(f"""Start to edit goal with goal_id:{goal_id}
                     for user {user_id}""")
    query = """
            MATCH(g:Goal{goal_id: $goal_id})
            SET g.goal_id = $goal_id,
                g.deadline = $deadline,
                g.owner_id = $owner_id,
                g.description = $description
            RETURN g 
            """
    parameters = {"goal_id": goal_id,
                  "deadline": goal.deadline,
                  "owner_id": user_id,
                  "description": goal.description}
    try:
        with driver.session() as session:
            records = session.run(query, parameters)
            summary = records.consume()
            counters = summary.counters
            logger.debug(f"Properties set: {counters.properties_set}")

    except neo4j_ex.SessionError as ex:
        raise my_ex.FetchError("Session error") from ex

    except neo4j_ex.ResultConsumedError as ex:
        raise my_ex.FetchError("ResultConsumedError") from ex
    logger.debug(f"Goal with goal_id:{goal_id} was succesfully edit")
    return goal
