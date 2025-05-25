from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.extensions import messages_collection

bp = Blueprint('message', __name__)


@bp.route('/messages/<recipient_id>', methods=['GET'])
@login_required
def get_conversation(recipient_id):
    messages = messages_collection.find({
        "$or": [
            {"sender_id": current_user.id, "recipient_id": recipient_id},
            {"sender_id": recipient_id, "recipient_id": current_user.id}
        ]
    }).sort("timestamp", 1)

    return jsonify([
        {
            "sender_id": msg["sender_id"],
            "recipient_id": msg["recipient_id"],
            "message": msg["message"],
            "timestamp": msg["timestamp"]
        } for msg in messages
    ])
