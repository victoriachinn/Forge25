from pymongo import MongoClient
from bson import ObjectId
import datetime
from config import MONGO_URI
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi

# Create a new client and connect to the server
client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tls=True, tlsCAFile=certifi.where())
db = client["moosement"]
users_collection = db["user_data"]

# ---- User Schema ----
USER_SCHEMA = {
    "user_id": str,  # Unique identifier
    "name": str,  # User's full name
    "email": str,  # Unique email
    "password_hash": str,  # Hashed password
    "created_at": str,  # Timestamp
    "updated_at": str,  # Timestamp
    "team_id": str,  # The team the user belongs to (nullable)
    "company_id": str,  # The company the user belongs to
}


# ---- Helper Functions ----

def create_user(name, email, password_hash, company_id):
    """
    Creates a new user in the database.
    """
    if users_collection.find_one({"email": email}):
        return None  # Email already exists

    user_data = {
        "user_id": str(ObjectId()),
        "name": name,
        "email": email,
        "password_hash": password_hash,  # Store securely
        "created_at": datetime.datetime.utcnow().isoformat(),
        "updated_at": datetime.datetime.utcnow().isoformat(),
        "team_id": None,  # Default: No team assigned
        "company_id": company_id,
    }
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)  # Return the created user's ID


def get_user_by_id(user_id):
    """
    Fetches a user by their unique user ID.
    """

    try:
        _id = ObjectId(user_id)
        user = users_collection.find_one({"_id": user_id}, {"_id": 0, "password_hash": 0})
        return user

    except Exception as e:
        return {"error": "Invalid user ID format"}



def get_user_by_email(email):
    """
    Fetches a user by their email.
    """
    user = users_collection.find_one({"email": email})
    return user if user else None


def update_user(user_id, updates):
    """
    Updates user details with provided dictionary fields.
    """
    updates["updated_at"] = datetime.datetime.utcnow().isoformat()
    result = users_collection.update_one({"user_id": user_id}, {"$set": updates})
    return result.modified_count > 0  # Returns True if update succeeded


def assign_team(user_id, team_id):
    """
    Assigns a user to a team.
    """
    return update_user(user_id, {"team_id": team_id})


def delete_user(user_id):
    """
    Deletes a user from the database.
    """
    result = users_collection.delete_one({"user_id": user_id})
    return result.deleted_count > 0  # Returns True if user was deleted
