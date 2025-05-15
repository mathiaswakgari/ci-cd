from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_login import LoginManager
from dotenv import dotenv_values
from cryptography.fernet import Fernet
import pymongo
import rsa

# Global SocketIO initialization
socketio = SocketIO(
    cors_allowed_origins="http://localhost:3000", manage_session=True)

login_manager = LoginManager()


def create_app():
    app = Flask(__name__)
    # Use environment variable or config for production
    app.secret_key = 'your_secret_key'

    # CORS setup for local dev
    CORS(app, origins="http://localhost:3000", supports_credentials=True)
    socketio.init_app(app)

    # Register blueprints for routes
    from app.routes import auth_routes, user_routes, message_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(user_routes.bp)
    app.register_blueprint(message_routes.bp)

    # Initialize SocketIO events
    from app.socket import message_socket
    message_socket.init_socket(socketio)

    # Initialize LoginManager
    login_manager.init_app(app)
    from app.models.user_model import load_user
    login_manager.user_loader(load_user)

    return app


# Load sensitive data from .env file
config = dotenv_values(".env")

# Global RSA Key generation (for demo; use secure storage in production)
public_key, private_key = rsa.newkeys(2048)

# MongoDB Setup using environment variables from .env
# Make sure FERNET_SECRET_KEY exists in .env
fernet_key = config["FERNET_SECRET_KEY"].encode()
fernet = Fernet(fernet_key)

# Ensure MONGO_URI is in .env
client = pymongo.MongoClient(config["MONGO_URI"])
db = client['secure_messaging']
users_collection = db['users']
messages_collection = db['messages']
