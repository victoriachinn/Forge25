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
