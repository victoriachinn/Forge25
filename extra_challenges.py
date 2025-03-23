from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]
teams_collection = db["team_data"]

EXERCISE_MULTIPLIERS = {
    "running": 10,  # points per mile
    "walking": 5,   # points per mile
    "cycling": 8,   # points per mile
    "swimming": 5, # points per lap 25m
    "rowing": 12,   # points per 500m
    "strength_training": 5,  # points per 10 min
    "yoga": 3,      # points per 10 min
    "other": 4      # points per 10 min
}

@app.route('/api/exercise/log', methods=['POST'])
def log_exercise():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        exercise_type = data.get("exercise_type")
        value = data.get("value")  # distance in miles, laps, or time in minutes

        if not all([user_id, exercise_type, value]):
            return jsonify({"error": "Missing required fields"}), 400

        user_object_id = ObjectId(user_id)
        user = users_collection.find_one({"_id": user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        points_earned = calculate_points(exercise_type, value)

        exercise_record = {
            "exercise_type": exercise_type,
            "value": value,
            "points_earned": points_earned,
            "logged_at": datetime.utcnow().isoformat()
        }
        users_collection.update_one(
            {"_id": user_object_id},
            {
                "$push": {"logged_exercises": exercise_record},
                "$inc": {"total_points": points_earned, "points": points_earned}
            }
        )

        team_id = user.get("team_id")
        if team_id:
            teams_collection.update_one(
                {"_id": ObjectId(team_id)},
                {"$inc": {"total_team_points": points_earned}}
            )
        
        return jsonify({
            "message": "Exercise logged successfully",
            "exercise": exercise_type,
            "value": value,
            "points_earned": points_earned
        })
    except Exception as e:
        return jsonify({"error": "An error occurred while logging the exercise"}), 500


def calculate_points(exercise_type, value):
    multiplier = EXERCISE_MULTIPLIERS.get(exercise_type, EXERCISE_MULTIPLIERS["other"])
    if exercise_type in ["running", "walking", "cycling"]:
        return int(value * multiplier)
    elif exercise_type in ["swimming", "rowing"]:
        return int(value * multiplier)
    else:  # timed activities
        return int((value / 10) * multiplier)

if __name__ == '__main__':
    app.run(debug=True)
