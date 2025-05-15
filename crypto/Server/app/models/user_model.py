from flask_login import UserMixin
from bson import ObjectId
from app.extensions import users_collection


class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id


def load_user(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return User(str(user["_id"]))
    return None
