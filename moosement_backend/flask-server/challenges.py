# challenges.py
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from config import config

# Initialize blueprint
challenges_bp = Blueprint('challenges', __name__)

# Database connection
client = MongoClient(config.MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]
challenges_collection = db["challenges"]
teams_collection = db["team_data"]

def update_user_streak(user_id):
    """Update user's streak based on challenge completion history"""
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return
    
    # Get the last completion timestamp
    completed_challenges = user.get("completed_challenges", [])
    if not completed_challenges:
        return 1
    
    last_completion = completed_challenges[-1].get("completed_at")
    if not last_completion:
        return 1
    
    # Convert ISO string to datetime
    last_completion_date = datetime.fromisoformat(last_completion)
    current_date = datetime.utcnow()
    
    # Check if the last completion was yesterday
    time_diff = current_date.date() - last_completion_date.date()
    if time_diff.days == 1:
        return user.get("streaks", 0) + 1
    elif time_diff.days == 0:  # Same day completion
        return user.get("streaks", 0)
    else:  # Streak broken
        return 1

# Get all challenges
@challenges_bp.route('/get_challenges', methods=['GET'])
def get_challenges():
    challenges_list = list(challenges_collection.find({}, {"_id": 0}))
    return jsonify({"challenges": challenges_list})

# Complete a challenge
@challenges_bp.route('/complete', methods=['POST'])
def complete_challenge():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["user_id", "challenge_id"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        user_id = data["user_id"]
        challenge_id = data["challenge_id"]
        
        # Validate ObjectIds
        try:
            user_object_id = ObjectId(user_id)
            challenge_object_id = ObjectId(challenge_id)
        except:
            return jsonify({"error": "Invalid ID format"}), 400
        
        # Get user and challenge data
        user = users_collection.find_one({"_id": user_object_id})
        challenge = challenges_collection.find_one({"_id": challenge_object_id})
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404
            
        # Check if challenge was already completed today
        today = datetime.utcnow().date().isoformat()
        completed_challenges = user.get("completed_challenges", [])
        
        for completed in completed_challenges:
            if (completed.get("challenge_id") == str(challenge_id) and 
                completed.get("completed_at", "").startswith(today)):
                return jsonify({"error": "Challenge already completed today"}), 400
        
        # Calculate points
        base_points = challenge.get("points", 0)
        streak = update_user_streak(user_id)
        streak_multiplier = min(streak * 0.1, 0.5)  # Cap streak bonus at 50%
        total_points = int(base_points * (1 + streak_multiplier))
        
        # Update user's completed challenges and points
        completion_record = {
            "challenge_id": str(challenge_id),
            "challenge_name": challenge.get("name"),
            "points_earned": total_points,
            "completed_at": datetime.utcnow().isoformat(),
            "streak": streak
        }
        
        users_collection.update_one(
            {"_id": user_object_id},
            {
                "$push": {"completed_challenges": completion_record},
                "$inc": {"total_points": total_points, "points": total_points},
                "$set": {"streaks": streak, "updated_at": datetime.utcnow().isoformat()}
            }
        )
        
        # Update team points if user is part of a team
        team_id = user.get("team_id")
        if team_id:
            try:
                teams_collection.update_one(
                    {"_id": ObjectId(team_id)},
                    {
                        "$inc": {"total_team_points": total_points},
                        "$set": {"updated_at": datetime.utcnow().isoformat()}
                    }
                )
            except Exception as e:
                # Log team update error but don't fail the request
                print(f"Error updating team points: {str(e)}")
        
        return jsonify({
            "message": "Challenge completed successfully",
            "points_earned": total_points,
            "current_streak": streak,
            "total_points": user.get("total_points", 0) + total_points
        }), 200
        
    except Exception as e:
        # Log the error
        return jsonify({"error": "An error occurred while completing the challenge"}), 500
