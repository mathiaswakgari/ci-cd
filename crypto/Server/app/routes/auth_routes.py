# app/routes/auth_routes.py
from flask import Blueprint, request, jsonify, session
from flask_cors import CORS
from flask_login import login_user, logout_user, LoginManager, UserMixin
from bson import ObjectId
import bcrypt
from rsa import newkeys

from app.extensions import users_collection, aes_encrypt

bp = Blueprint('auth', __name__, url_prefix='/auth')
CORS(bp, supports_credentials=True)

login_manager = LoginManager()


class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.username = user_data['username']
        self.data = user_data

    def get_id(self):
        return self.id


@login_manager.user_loader
def load_user(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return User(user) if user else None


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    fullname = data.get('fullname')
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    gender = data.get('gender')

    if not all([fullname, username, password, confirm_password, gender]):
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    avatar_base = "https://avatar.iran.liara.run/public"
    avatar = f"{avatar_base}/boy?username={username}" if gender == "male" else f"{avatar_base}/girl?username={username}"

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    public_key, private_key = newkeys(2048)

    encrypted_private_key_b64 = aes_encrypt(private_key.save_pkcs1())

    user_data = {
        "fullname": fullname,
        "username": username,
        "password": hashed_password,
        "gender": gender,
        "avatar": avatar,
        "public_key": public_key.save_pkcs1().decode(),
        "private_key": encrypted_private_key_b64
    }

    user_id = users_collection.insert_one(user_data).inserted_id

    return jsonify({
        "user_id": str(user_id),
        "fullname": fullname,
        "username": username,
        "avatar": avatar
    })


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = users_collection.find_one({"username": username})

    if not user or not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 400

    user_obj = User(user)
    login_user(user_obj)

    return jsonify({
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "fullname": user["fullname"],
        "username": user["username"],
        "avatar": user["avatar"],
        "public_key": user.get("public_key"),
        "private_key": user.get("private_key")
    })


@bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    session.clear()
    return jsonify({"message": "Logout successful"})
