from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]
rewards_collection = db["rewards"]

# sample rewards
default_rewards = [
    {"name": "Dinner Gift Card", "points_required": 5000},
    {"name": "Extra PTO Day", "points_required": 10000},
    {"name": "Fitness Gear Credit", "points_required": 7500}
]

# initialize rewards in the database if they don't exist
if rewards_collection.count_documents({}) == 0:
    rewards_collection.insert_many(default_rewards)

@app.route('/api/rewards', methods=['GET'])
def get_rewards():
    rewards = list(rewards_collection.find({}, {"_id": 0}))
    return jsonify({"rewards": rewards})

@app.route('/api/rewards/redeem', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)
