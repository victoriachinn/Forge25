from flask import Blueprint, request, jsonify
from moosement_backend.models.teams import create_team, join_team
from moosement_backend.models.users import get_user_by_id
from bson import ObjectId

team_routes = Blueprint("team_routes", __name__)

@team_routes.route("/teams/create", methods=["POST"])
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


@team_routes.route("/teams/join", methods=["POST"])
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
