# users_bp.py
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from bson import ObjectId
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]
challenges_collection = db["challenges"]
teams_collection = db["team_data"]

# Initialize the blueprint
users_bp = Blueprint("users_bp", __name__)

# Route for user registration
@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required_fields = ["name", "email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    name = data["name"]
    email = data["email"]
    password = data["password"]

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User with this email already exists"}), 409

    hashed_password = generate_password_hash(password)

    new_user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "points": 0,
        "joined_date": data.get("joined_date") or datetime.utcnow().isoformat(),
        "company_id": data.get("company_id"),
        "team_id": None,
        "total_points": 0,
        "completed_challenges": [],
        "streaks": 0,
        "role": "employee",  # Default role
        "rewards_claimed": [],
        "team_rank": None,
        "user_avatar": None,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    insert_result = users_collection.insert_one(new_user)
    return jsonify({"message": "User registered successfully", "user_id": str(insert_result.inserted_id)}), 201

# Route for user login
@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check that the user entered an email and a password
    required_fields = ["email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    email = data["email"]
    password = data["password"]

    user = users_collection.find_one({"email": email})
    
    # If no user exists with that email, return an error
    if not user:
        return jsonify({"error": "Invalid email"}), 400

    # Unhashes the stored password and checks if it matches the plaintext password
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid password"}), 400
    
    # If login credentials are valid, return a success message
    return jsonify({"message": "User logged in successfully", "user_id": str(user["_id"])}), 200

@users_bp.route('/update', methods=['PUT'])
def update_profile():
    data = request.get_json()

    # Verify user is authenticated (you'll need to implement proper authentication)
    user_id = data.get("user_id")  # This should come from authentication token in production
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        # Convert string ID to MongoDB ObjectId
        object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    # Find the current user
    current_user = users_collection.find_one({"_id": object_id})
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    # Fields that are allowed to be updated
    updatable_fields = {
        "name": str,
        "email": str,
        "team_id": str,
        "user_avatar": str,
        "company_id": str
    }

    # Validate and prepare updates
    updates = {}
    for field, field_type in updatable_fields.items():
        if field in data:
            # Type validation
            if not isinstance(data[field], field_type):
                return jsonify({"error": f"Invalid type for field {field}"}), 400

            # Email specific validation
            if field == "email":
                # Check if new email already exists for a different user
                existing_user = users_collection.find_one({
                    "email": data[field],
                    "_id": {"$ne": object_id}  # Exclude current user
                })
                if existing_user:
                    return jsonify({"error": "Email already in use"}), 409

            updates[field] = data[field]

# Route to get the user's activity streaks
@users_bp.route('/<user_id>/streaks', methods=['GET'])
def get_streaks(user_id):
    try:
        # Convert string ID to MongoDB ObjectId
        object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    # Find the user
    user = users_collection.find_one({"_id": object_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Return the user's streaks (You can calculate streaks based on `completed_challenges` or a different strategy)
    streaks = user.get("streaks", [])
    return jsonify({"streaks": streaks}), 200

# Route to get the user's profile data
@users_bp.route('/<user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    try:
        # Convert string ID to MongoDB ObjectId
        object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    # Find the user
    user = users_collection.find_one({"_id": object_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Return relevant profile data (you can modify this as needed)
    profile_data = {
        "name": user.get("name"),
        "email": user.get("email"),
        "total_points": user.get("total_points"),
        "team_rank": user.get("team_rank"),
        "user_avatar": user.get("user_avatar"),
        "joined_date": user.get("joined_date")
    }
    return jsonify(profile_data), 200

# Route to get the user's activity log
@users_bp.route('/<user_id>/activity-log', methods=['GET'])
def get_activity_log(user_id):
    try:
        # Convert string ID to MongoDB ObjectId
        object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    # Find the user
    user = users_collection.find_one({"_id": object_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Fetch activity logs for the user (based on completed challenges or activity data)
    activity_logs = user.get("completed_challenges", [])
    
    # Map activity logs to a suitable format (add more details if needed)
    formatted_logs = [
        {
            "activity": log.get("activity_type"),
            "date": log.get("completed_at"),
            "duration": log.get("duration", "N/A"),
            "points": log.get("points_earned", 0)
        }
        for log in activity_logs
    ]
    
    return jsonify({"activity_logs": formatted_logs}), 200

# Route to get a summary of the user's activity (total activities, longest streak, etc.)
@users_bp.route('/<user_id>/activity-summary', methods=['GET'])
def get_activity_summary(user_id):
    try:
        # Convert string ID to MongoDB ObjectId
        object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    # Find the user
    user = users_collection.find_one({"_id": object_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Calculate the activity summary (this is an example, you might want to change it based on your data)
    total_activities = len(user.get("completed_challenges", []))
    longest_streak = max(user.get("streaks", [0]))  # Assuming streaks are stored as a list of streak lengths

    # Most frequent activity
    activities = [log.get("activity_type") for log in user.get("completed_challenges", [])]
    most_frequent_activity = max(set(activities), key=activities.count) if activities else "N/A"

    summary = {
        "total_activities": total_activities,
        "longest_streak": longest_streak,
        "most_frequent_activity": most_frequent_activity
    }

    return jsonify(summary), 200

# Fetch user challenges
@users_bp.route('/<user_id>/challenges', methods=['GET'])
def get_user_challenges(user_id):
    try:
        # Fetch user data
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get completed challenges
        completed_challenges = user.get("completed_challenges", [])
        
        # Create response data
        challenges = [
            {
                "_id": str(challenge.get("challenge_id")),
                "date": challenge.get("completed_at").split("T")[0],  # ISO date format (YYYY-MM-DD)
                "activity": challenge.get("challenge_name"),
                "icon": "fire",  # Or retrieve from challenge data if available
                "streak": challenge.get("streak", 1)
            }
            for challenge in completed_challenges
        ]
        
        return jsonify({"challenges": challenges}), 200
    except Exception as e:
        print(f"Error fetching user challenges: {str(e)}")
        return jsonify({"error": "An error occurred while fetching challenges"}), 500

