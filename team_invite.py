from flask import Flask, request, jsonify, url_for
from pymongo import MongoClient
from bson import ObjectId
import shortuuid #pip install shortuuid

app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]
teams_collection = db["team_data"]

@app.route('/api/team/invite', methods=['POST'])
def invite_member():
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        team_id = user.get("team_id")
        if not team_id:
            return jsonify({"error": "User is not part of a team"}), 400
        
        invite_code = shortuuid.uuid()
        invite_link = url_for('accept_invite', invite_code=invite_code, _external=True)
        
        teams_collection.update_one(
            {"_id": ObjectId(team_id)},
            {"$push": {"invites": {"code": invite_code, "created_by": user_id}}}
        )
        
        return jsonify({
            "message": "Invite link generated successfully",
            "invite_link": invite_link
        }), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while generating the invite"}), 500

@app.route('/api/team/accept_invite/<invite_code>', methods=['POST'])
def accept_invite(invite_code):
    try:
        data = request.get_json()
        new_user_id = data.get("user_id")
        
        if not new_user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        team = teams_collection.find_one({"invites.code": invite_code})
        if not team:
            return jsonify({"error": "Invalid invite code"}), 404
        
        team_id = team["_id"]
        
        users_collection.update_one(
            {"_id": ObjectId(new_user_id)},
            {"$set": {"team_id": str(team_id)}}
        )
        
        teams_collection.update_one(
            {"_id": team_id},
            {"$pull": {"invites": {"code": invite_code}}}
        )
        
        return jsonify({"message": "User successfully joined the team"}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while accepting the invite"}), 500

if __name__ == '__main__':
    app.run(debug=True)
