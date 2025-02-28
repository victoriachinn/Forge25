from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.security import check_password_hash

app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    # check that the user entered in an email and a password
    required_fields = ["email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    email = data["email"]
    password = data["password"]

    user = users_collection.find_one({"email": email})
    # if no user exists with that email, return an error
    if not user:
        return jsonify({"error": "Invalid email"}), 400

    # unhashes the stored password and checks if it is the same as the plaintext password
    if not check_password_hash(user["password"], password)":
        return jsonify({"error": "Invalid password"}), 400
    
    # if login credentials are valid: (can change to redirect to home page)
    return jsonify({'message': 'Login successful'}), 200
  
if __name__ == '__main__':
    app.run(debug=True)