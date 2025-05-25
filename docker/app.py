from tasks import test
from celery_config import celery_init_app
from dotenv import load_dotenv
from datetime import timedelta
from flask import Flask
import logging
import os


load_dotenv()
print(os.getenv("REDIS_URL"))


application = Flask(__name__)
application.secret_key = "super secret key"
application.config.from_mapping(
        CELERY=dict(
            broker_url=os.getenv("REDIS_URL"),
            include=['tasks'],
            task_ignore_result=True,
            broker_connection_retry_on_startup= True
        ),
)


celery_app = celery_init_app(application)

handler = logging.FileHandler('app.log')  

logger = application.logger

logger.addHandler(handler)

if __name__ == "__main__":
    application.run(debug=True)

@application.route('/')
def home():
    test.delay()
    return "Hello, Flask!"
