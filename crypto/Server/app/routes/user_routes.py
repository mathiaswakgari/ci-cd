from app import public_key
from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from app.extensions import users_collection
from bson import ObjectId
from flask_cors import cross_origin

bp = Blueprint('user', __name__)


@bp.route('/users', methods=['GET'])
@cross_origin(supports_credentials=True)  
@login_required
def get_users():
    all_users = users_collection.find(
        {}, {"username": 1, "avatar": 1})

    user_list = []
    for user in all_users:
        if str(user["_id"]) != str(current_user.id):
            user_list.append({
                "_id": str(user["_id"]),
                "username": user["username"],
                "image": user.get("avatar", ""),
            })
    return jsonify(user_list)


@bp.route('/user/<user_id>/public-key', methods=['GET'])
def get_public_key(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user and "public_key" in user:
        return jsonify({'public_key': user["public_key"]})
    return jsonify({'error': 'Public key not found'}), 404
