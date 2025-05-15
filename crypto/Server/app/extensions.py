from dotenv import dotenv_values
from cryptography.fernet import Fernet
import pymongo

config = dotenv_values(".env")

fernet_key = config.get("FERNET_SECRET_KEY", "").encode()
fernet = Fernet(fernet_key)

client = pymongo.MongoClient(config.get("MONGO_URI", "mongodb://localhost:27017/secure_messaging"))
db = client['secure_messaging']
users_collection = db['users']
messages_collection = db['messages']