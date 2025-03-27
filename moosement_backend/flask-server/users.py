# users_bp.py
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash

# Initialize the blueprint
users_bp = Blueprint("users_bp", __name__)

# MongoDB connection
MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]

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
