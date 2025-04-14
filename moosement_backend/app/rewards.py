
from bson import ObjectId
from datetime import datetime
from config import MONGO_URI
from flask import Flask, request, jsonify
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import certifi

rewards_bp = Blueprint('rewards_bp', __name__)

client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tls=True, tlsCAFile=certifi.where())
db = client["moosement"]
users_collection = db["user_data"]
rewards_collection = db["rewards_data"]

# sample rewards
default_rewards = [
    {"name": "Dinner Gift Card", "points_required": 5000},
    {"name": "Extra PTO Day", "points_required": 10000},
    {"name": "Fitness Gear Credit", "points_required": 7500}
]

@rewards_bp.route('/rewards', methods=['GET'])
def get_rewards():
    rewards = list(rewards_collection.find({}, {"_id": 0}))
    return jsonify({"rewards": rewards})


@rewards_bp.route('/redeem', methods=['POST'])
def redeem_reward():
    data = request.get_json()
    user_id = data.get("user_id")
    reward_name = data.get("reward_name")

    if not user_id or not reward_name:
        return jsonify({"error": "User ID and Reward Name are required"}), 400

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    reward = rewards_collection.find_one({"name": reward_name})

    if not user:
        return jsonify({"error": "User not found"}), 404
    if not reward:
        return jsonify({"error": "Reward not found"}), 404

    user_points = user.get("total_points", 0)
    required_points = reward["points_required"]

    if user_points < required_points:
        return jsonify({"error": "Not enough points to redeem this reward"}), 400

    # deduct points and update user history
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$inc": {"total_points": -required_points},
            "$push": {"redeemed_rewards": {
                "reward_name": reward_name,
                "points_spent": required_points,
                "redeemed_at": datetime.utcnow().isoformat()
            }},
            "$set": {"updated_at": datetime.utcnow().isoformat()}
        }
    )

    return jsonify({
        "message": f"Successfully redeemed {reward_name}",
        "remaining_points": user_points - required_points
    }), 200
