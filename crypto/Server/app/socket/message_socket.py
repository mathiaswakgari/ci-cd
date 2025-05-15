from flask_socketio import emit
from flask_login import current_user
from app.extensions import users_collection, messages_collection, fernet
from bson import ObjectId
from datetime import datetime
import rsa
import base64


def init_socket(socketio):
    @socketio.on('send_message')
    def handle_send_message(data):
        encrypted_b64 = data.get("message")
        recipient_id = data.get("recipient_id")

        if not encrypted_b64 or not recipient_id:
            emit("error", {"error": "Missing fields"})
            return

        try:
            # Decode the base64-encoded encrypted message
            encrypted_bytes = base64.b64decode(encrypted_b64.encode())

            # Get current user's encrypted private key from DB
            user = users_collection.find_one(
                {"_id": ObjectId(current_user.id)})
            if not user or 'private_key' not in user:
                emit("error", {"error": "Private key not found"})
                return

            encrypted_private_key = user['private_key']
            # Log first 50 chars
            print(
                f"[DEBUG] Encrypted private key (Base64): {encrypted_private_key[:50]}...")

            # Step 1: Ensure the private key is correctly decrypted
            try:
                # Decode the base64-encoded encrypted private key back into bytes
                encrypted_private_key_bytes = encrypted_private_key.encode()

                # Decrypt the private key using Fernet
                decrypted_key = fernet.decrypt(encrypted_private_key_bytes)
                # Print part of key for debugging
                print(
                    f"[DEBUG] Decrypted private key: {decrypted_key[:50]}...")
            except Exception as e:
                print(f"[ERROR] Fernet decryption failed: {e}")
                emit("error", {"error": "Private key decryption failed"})
                return

            # Step 2: Ensure the decrypted key is in proper format (PEM)
            try:
                # Load the private key from the decrypted bytes (should be in PEM format)
                private_key = rsa.PrivateKey.load_pkcs1(decrypted_key)
                print("[DEBUG] Private key loaded successfully")
            except ValueError as e:
                print(f"[ERROR] Invalid private key format: {e}")
                emit("error", {"error": "Invalid private key format"})
                return
            except Exception as e:
                print(f"[ERROR] Key loading failed: {e}")
                emit("error", {"error": "Private key loading failed"})
                return

            # Step 3: Decrypt the message using the private key
            try:
                decrypted_message = rsa.decrypt(
                    encrypted_bytes, private_key).decode()
                print(f"[DEBUG] Decrypted message: {decrypted_message}")
            except rsa.pkcs1.DecryptionError as e:
                print(f"[ERROR] RSA Decryption failed: {e}")
                emit("error", {"error": "RSA Decryption failed"})
                return

            # Insert decrypted message into DB
            message_data = {
                "sender_id": current_user.id,
                "recipient_id": recipient_id,
                "message": decrypted_message,
                "timestamp": datetime.now()
            }
            messages_collection.insert_one(message_data)

            # Broadcast the decrypted message to all clients
            emit("receive_message", {
                "sender_id": current_user.id,
                "recipient_id": recipient_id,
                "message": decrypted_message
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
