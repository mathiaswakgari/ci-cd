# app/extensions.py

import os
import base64
import pymongo
from dotenv import dotenv_values
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

config = dotenv_values(".env")

AES_KEY_B64 = os.environ.get("AES_KEY") or config.get("AES_KEY")
if AES_KEY_B64 is None:
    raise ValueError("AES_KEY is not set in the environment or .env file")

try:
    AES_KEY = base64.b64decode(AES_KEY_B64)
except Exception as e:
    raise ValueError("Failed to decode AES_KEY from base64") from e

if len(AES_KEY) not in (16, 24, 32):
    raise ValueError(
        f"Invalid AES key length: {len(AES_KEY)} bytes. Must be 16, 24, or 32 bytes.")



def aes_encrypt(plaintext: bytes) -> str:
    iv = os.urandom(16)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext) + padder.finalize()
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CBC(iv),
                    backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()
    return base64.b64encode(iv + ciphertext).decode()



def aes_decrypt(ciphertext_b64: str) -> bytes:
    raw = base64.b64decode(ciphertext_b64)
    iv = raw[:16]
    ciphertext = raw[16:]
    cipher = Cipher(algorithms.AES(AES_KEY), modes.CBC(iv),
                    backend=default_backend())
    decryptor = cipher.decryptor()
    padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    return unpadder.update(padded_plaintext) + unpadder.finalize()


client = pymongo.MongoClient(config.get(
    "MONGO_URI", "mongodb://localhost:27017/secure_messaging"))
db = client['secure_messaging']
users_collection = db['users']
messages_collection = db['messages']
