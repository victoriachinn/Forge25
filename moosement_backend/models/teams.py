from pymongo import MongoClient
from bson import ObjectId
from config import config
import datetime

# Connect to MongoDB
client = MongoClient(config.MONGO_URI)
db = client["moosement"]
teams_collection = db["teams"]
users_collection = db["users"]

# Team Schema (for reference)
TEAM_SCHEMA = {
    "team_id": str,  # Unique identifier
    "name": str,  # Team name
    "company_id": str,  # Company ID the team belongs to
    "created_at": str,  # Timestamp
    "updated_at": str,  # Timestamp
    "members": list,  # List of user IDs in the team
}

# ---- Helper Functions ----

def create_team(name, company_id, creator_id):
    """
    Creates a new team and adds the creator as the first member.
    """
    team_data = {
        "team_id": str(ObjectId()),
        "name": name,
        "company_id": company_id,
        "created_at": datetime.datetime.utcnow().isoformat(),
        "updated_at": datetime.datetime.utcnow().isoformat(),
        "members": [creator_id],  # Creator is the first member
    }
    result = teams_collection.insert_one(team_data)

    # Update user to reflect the new team
    users_collection.update_one(
        {"_id": ObjectId(creator_id)}, {"$set": {"team_id": team_data["team_id"]}}
    )

    return str(result.inserted_id)  # Return team ID


def join_team(user_id, team_id):
    """
    Adds a user to an existing team.
    """
    team = teams_collection.find_one({"team_id": team_id})
    if not team:
        return False  # Team does not exist

    # Add user to the team if not already a member
    if user_id not in team["members"]:
        teams_collection.update_one(
            {"team_id": team_id}, {"$push": {"members": user_id}}
        )
        users_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": {"team_id": team_id}}
        )
        return True

    return False  # User already in the team