from flask_socketio import emit
from flask_login import current_user
from app.extensions import users_collection, messages_collection
from datetime import datetime, timezone
from bson import ObjectId
from datetime import datetime


def init_socket(socketio):
    @socketio.on('send_message')
    def handle_send_message(data):
        encrypted_b64 = data.get("message")
        recipient_id = data.get("recipient_id")
        if not encrypted_b64 or not recipient_id:
            emit("error", {"error": "Missing fields"})

            return

        try:
            recipient = users_collection.find_one(
                {"_id": ObjectId(recipient_id)})
            if not recipient:
                emit("error", {"error": "Recipient not found"})
                return
            now_utc = datetime.now(timezone.utc)

            message_data = {
                "sender_id": current_user.id,
                "recipient_id": recipient_id,
                "message": encrypted_b64, 
                "timestamp": now_utc
            }
            messages_collection.insert_one(message_data)

            emit("receive_message", {
                "sender_id": current_user.id,
                "recipient_id": recipient_id,
                "message": encrypted_b64,
                "timestamp": message_data["timestamp"].isoformat()
            }, broadcast=True)

        except Exception as e:
            print(f"[ERROR] Unexpected error: {e}")
            emit("error", {"error": "Message handling failed"})

    @socketio.on('connect')
    def on_connect():
        try:
            online_users = [str(user["_id"])
                            for user in users_collection.find()]
            emit("getOnlineUsers", online_users, broadcast=True)
        except Exception as e:
            print(f"[ERROR] Online user fetch error: {e}")
            emit("error", {"error": "Failed to fetch online users"})
