from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash

app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]

@app.route('/api/register', methods=['POST'])
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

@app.route('/api/profile/update', methods=['PUT'])
def update_profile():
    data = request.get_json()
    
    # Verify user is authenticated (you'll need to implement proper authentication)
    user_email = data.get("current_email")  # This should come from authentication token in production
    if not user_email:
        return jsonify({"error": "Authentication required"}), 401
    
    # Find the current user
    current_user = users_collection.find_one({"email": user_email})
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
            if field == "email" and data[field] != user_email:
                # Check if new email already exists
                if users_collection.find_one({"email": data[field]}):
                    return jsonify({"error": "Email already in use"}), 409
            
            updates[field] = data[field]
    
    # If no valid fields to update
    if not updates:
        return jsonify({"error": "No valid fields to update"}), 400
    
    # Add updated_at timestamp
    updates["updated_at"] = datetime.utcnow().isoformat()
    
    # Perform update
    result = users_collection.update_one(
        {"email": user_email},
        {"$set": updates}
    )
    
    if result.modified_count == 0:
        return jsonify({"error": "No changes made"}), 400
    
    return jsonify({
        "message": "Profile updated successfully",
        "updated_fields": list(updates.keys())
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
