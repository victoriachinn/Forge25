# users_bp.py
from flask import Blueprint, request, jsonify
from pymongo import MongoClient

from pymongo.server_api import ServerApi
from datetime import datetime
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from bson import ObjectId
from config import MONGO_URI
import certifi

client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tls=True, tlsCAFile=certifi.where())

db = client["moosement"]
users_collection = db["user_data"]
challenges_collection = db["challenge_data"]
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
        "redeemed_rewards": [],  # Field name to match what frontend expects
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

# API route to get the total points for a user
@users_bp.route("/points", methods=["GET"])
def get_user_points():
    # Get user_id from query parameters
    user_id = request.args.get("user_id")

    # Check that a user_id was received
    if not user_id:
        return jsonify({
            "error": "Missing parameter: user_id",
            "total_points": 0,
            "redeemed_rewards": []
        }), 400

    try:
        # Debug print to see the actual user_id value
        print(f"Looking up user with ID: {user_id}")
        
        # Make sure user_id is a valid format before trying to convert
        if not ObjectId.is_valid(user_id):
            print(f"Invalid ObjectId format: {user_id}")
            return jsonify({
                "error": "Invalid user ID format",
                "total_points": 0,
                "redeemed_rewards": []
            }), 400
            
        # Look up the user
        user = users_collection.find_one({"_id": ObjectId(user_id)})

        # If no user exists with that ID, return an error
        if not user:
            print(f"No user found with ID: {user_id}")
            return jsonify({
                "error": "User not found",
                "total_points": 0,
                "redeemed_rewards": []
            }), 404

        # Get the redeemed rewards if they exist
        redeemed_rewards = user.get("redeemed_rewards", [])
        
        # If redeemed_rewards is None or not an array, set it to empty array
        if redeemed_rewards is None or not isinstance(redeemed_rewards, list):
            redeemed_rewards = []
            
        # Ensure each reward has the expected fields
        for reward in redeemed_rewards:
            if not isinstance(reward, dict):
                continue
            # Make sure reward_name exists
            if "reward_name" not in reward:
                reward["reward_name"] = "Unknown Reward"
            # Make sure points_spent exists
            if "points_spent" not in reward:
                reward["points_spent"] = 0
            
        print(f"Found user with points: {user.get('total_points', 0)}")
        
        return jsonify({
            "user_id": user_id,
            "total_points": user.get("total_points", 0),
            "redeemed_rewards": redeemed_rewards
        }), 200
        
    except Exception as e:
        print(f"Error in get_user_points: {str(e)}")
        return jsonify({
            "error": f"An error occurred: {str(e)}",
            "user_id": user_id,
            "total_points": 0,
            "redeemed_rewards": []
        }), 500
