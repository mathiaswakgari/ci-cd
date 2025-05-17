from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_login import LoginManager
import rsa

# Generate RSA keys once globally
public_key, private_key = rsa.newkeys(2048)

# Global SocketIO
socketio = SocketIO(cors_allowed_origins="http://localhost:3000", manage_session=True)

login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_secret_key'  
    CORS(app, origins="http://localhost:3000", supports_credentials=True)
    socketio.init_app(app)

    from app.routes import auth_routes, user_routes, message_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(user_routes.bp)
    app.register_blueprint(message_routes.bp)

    from app.socket import message_socket
    message_socket.init_socket(socketio)

    login_manager.init_app(app)
    from app.models.user_model import load_user
    login_manager.user_loader(load_user)

    return app
