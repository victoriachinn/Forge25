from flask import Blueprint, request, jsonify
from models.teams import create_team, join_team
from models.users import get_user_by_id
from bson import ObjectId
import config
from pymongo import MongoClient
import shortuuid

client = MongoClient(config.MONGO_URI)
db = client["moosement"]
users_collection = db["user_data"]
challenges_collection = db["challenges"]
teams_collection = db["team_data"]

teams_bp = Blueprint("teams_bp", __name__)

@teams_bp.route("/teams/create", methods=["POST"])
def create_team_route():
    """
    Allows a user to create a team.
    """
    data = request.json
    name = data.get("name")
    company_id = data.get("company_id")
    creator_id = data.get("creator_id")

    if not name or not company_id or not creator_id:
        return jsonify({"error": "Missing required fields"}), 400

    user = get_user_by_id(creator_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    team_id = create_team(name, company_id, creator_id)
    return jsonify({"message": "Team created successfully", "team_id": team_id}), 201


@teams_bp.route("/teams/join", methods=["POST"])
def join_team_route():
    """
    Allows a user to join an existing team.
    """
    data = request.json
    user_id = data.get("user_id")
    team_id = data.get("team_id")

    if not user_id or not team_id:
        return jsonify({"error": "Missing required fields"}), 400

    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    success = join_team(user_id, team_id)
    if success:
        return jsonify({"message": "User added to the team successfully"}), 200
    return jsonify({"error": "Team not found or user already in team"}), 400

@teams_bp.route("/points", methods=["GET"])
def get_team_points():
    data = request.get_json()

    # check that a team_id to get standings for was received
    if "team_id" not in data:
            return jsonify({"error": f"Missing field: team_id"}), 400

    team_id = data["team_id"]

    team = teams_collection.find_one({"team_id": team_id})
    # if no team exists with that id, return an error
    if not team:
        return jsonify({"error": "Invalid team"}), 400

    return jsonify({
        "team_id": team_id,
        "team_total_points": team["total_team_points"]
    }), 200

def update_leaderboard():
    # Lists all the teams but sorted in descending order by their number of team points
    teams = list(teams_collection.find({}, {"_id": 0, "team_id": 1, "total_team_points": 1}).sort("total_team_points", DESCENDING))

    # Iterates through all the teams setting a rank for them
    for index, team in enumerate(teams):
        rank = index + 1
        teams_collection.update_one(
            {"team_id": team["team_id"]},
            {"$set": {"team_standing": rank}}
        )

# API route to update the leaderboard based off of the current points each team has
@teams_bp.route("/new_leaderboard", methods=["GET"])
def get_leaderboard():
    update_leaderboard()
    # Sorts the teams by their now updated standing to output as a list repreenting the leaderboard
    leaderboard = list(teams_collection.find({}, {"_id": 0, "team_id": 1, "total_team_points": 1, "team_standing": 1}).sort("team_standing", 1))

    return jsonify({"leaderboard": leaderboard})

@teams_bp.route('/invite', methods=['POST'])
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

@teams_bp.route('/accept_invite/<invite_code>', methods=['POST'])
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
