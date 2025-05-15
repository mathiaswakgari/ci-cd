from dotenv import dotenv_values

config = dotenv_values(".env")

class Config:
    SECRET_KEY = 'your_secret_key'
    FERNET_SECRET_KEY = config["FERNET_SECRET_KEY"]
    MONGO_URI = config["MONGO_URI"]
