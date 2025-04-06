from flask import jsonify, request, Blueprint
from pymongo import MongoClient
from bson import ObjectId
from config import config

user_points_bp = Blueprint('user_points', __name__)

client = MongoClient(config.MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]

# API route to get the total points for a user
@user_points_bp.route("user/points", methods=["GET"])
def get_user_points():
    data = request.get_json()

    # Check that a user_id was received
    if "user_id" not in data:
        return jsonify({"error": "Missing field: user_id"}), 400
    
    user_id = data["user_id"]

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        
        # If no user exists with that ID, return an error
        if not user:
            return jsonify({"error": "Invalid user"}), 400

        return jsonify({
            "user_id": user_id,
            "total_points": user.get("total_points", 0)
        }), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching user points"}), 500

