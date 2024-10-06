from loguru import logger
import os

# Определяем путь для файла логов
log_path = os.path.join(os.path.dirname(__file__), "logs.log")

# Настройка логирования
logger.remove()
logger.add(log_path, format="{time} {level} {message}", level="DEBUG")
