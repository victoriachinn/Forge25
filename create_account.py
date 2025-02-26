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
        "joined_date": data.get("joined_date") or datetime.utcnow().isoformat()
    }

    insert_result = users_collection.insert_one(new_user)

if __name__ == '__main__':
    app.run(debug=True)
