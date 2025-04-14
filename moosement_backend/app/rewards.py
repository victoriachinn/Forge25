
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

# Initialize default rewards if none exist
def init_rewards():
    try:
        # Check if rewards collection is empty
        if rewards_collection.count_documents({}) == 0:
            print("Initializing default rewards...")
            default_rewards = [
                {"name": "Free Lunch Voucher", "points_required": 150},
                {"name": "Late Start Pass", "points_required": 200},
                {"name": "Company T-Shirt", "points_required": 300},
                {"name": "Extra PTO Day", "points_required": 500},
                {"name": "Gift Card", "points_required": 200}
            ]
            rewards_collection.insert_many(default_rewards)
            print(f"Added {len(default_rewards)} default rewards")
        
        result = users_collection.update_one(
            {"email": "Michael@gmail.com"}, 
            {"$set": {"total_points": 1000, "points": 1000}},
            upsert=False
        )
        
        if result.matched_count > 0:
            print("Updated points for Michael@gmail.com to 1000 points")
        else:
            print("User with email Michael@gmail.com not found")
            
    except Exception as e:
        print(f"Error in init_rewards: {str(e)}")

# Call this function when the app starts
init_rewards()

@rewards_bp.route('/rewards', methods=['GET'])
def get_rewards():
    """
    Returns all available rewards.
    """
    try:
        rewards = list(rewards_collection.find({}, {"_id": 0}))
        print(f"Retrieved {len(rewards)} rewards")
        return jsonify({"rewards": rewards})
    except Exception as e:
        print(f"Error getting rewards: {str(e)}")
        return jsonify({"error": str(e), "rewards": []}), 500


@rewards_bp.route('/redeem', methods=['POST'])
def redeem_reward():
    """
    Allows a user to redeem a reward.
    """
    try:
        data = request.get_json()
        print(f"Redeem request: {data}")
        
        user_id = data.get("user_id")
        reward_name = data.get("reward_name")

        if not user_id or not reward_name:
            return jsonify({"error": "User ID and Reward Name are required"}), 400

        try:
            if not ObjectId.is_valid(user_id):
                return jsonify({"error": "Invalid user ID format"}), 400
                
            user = users_collection.find_one({"_id": ObjectId(user_id)})
        except Exception as e:
            return jsonify({"error": f"Invalid user ID format: {str(e)}"}), 400

        reward = rewards_collection.find_one({"name": reward_name})

        if not user:
            return jsonify({"error": "User not found"}), 404
        if not reward:
            return jsonify({"error": "Reward not found"}), 404

        user_points = user.get("total_points", 0)
        required_points = reward["points_required"]

        # Check if user already redeemed this reward
        redeemed_rewards = user.get("redeemed_rewards", [])
        if not isinstance(redeemed_rewards, list):
            redeemed_rewards = []
            
        if any(r.get("reward_name") == reward_name for r in redeemed_rewards if isinstance(r, dict)):
            return jsonify({"error": "Reward already redeemed"}), 400

        if user_points < required_points:
            return jsonify({"error": "Not enough points to redeem this reward"}), 400

        # Update user's points and redeemed rewards
        update_result = users_collection.update_one(
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

        if update_result.modified_count == 0:
            return jsonify({"error": "Failed to update user records"}), 500

        print(f"User {user_id} redeemed {reward_name}, remaining points: {user_points - required_points}")
        
        return jsonify({
            "message": f"Successfully redeemed {reward_name}",
            "remaining_points": user_points - required_points
        }), 200
    except Exception as e:
        print(f"Error in redeem_reward: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@rewards_bp.route('/user_rewards', methods=['GET'])
def get_user_rewards():
    """
    Returns the rewards redeemed by a specific user.
    """
    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        try:
            if not ObjectId.is_valid(user_id):
                return jsonify({"error": "Invalid user ID format"}), 400
                
            user = users_collection.find_one({"_id": ObjectId(user_id)})
        except:
            return jsonify({"error": "Invalid user ID format"}), 400

        if not user:
            return jsonify({"error": "User not found"}), 404

        redeemed_rewards = user.get("redeemed_rewards", [])
        
        # Ensure it's a list
        if not isinstance(redeemed_rewards, list):
            redeemed_rewards = []
        
        return jsonify({
            "user_id": user_id,
            "redeemed_rewards": redeemed_rewards
        }), 200
    except Exception as e:
        print(f"Error in get_user_rewards: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
