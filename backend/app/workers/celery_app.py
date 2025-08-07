from celery import Celery
from app.core import config

celery_app = Celery(
    "tasks",
    broker=config.REDIS_URL,
    backend=config.REDIS_URL,
    include=["app.workers.tasks"]
)

celery_app.conf.update(
    task_track_started=True,
)