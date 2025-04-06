from flask import Flask, jsonify
from pymongo import MongoClientfrom 
from pymongo import DESCENDING


app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
teams_collection = db["team_data"]

# Called when fetching the leaderboard to update each team's ranking based off of their current number of points
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
@app.get("/api/team/leaderboard")
def get_leaderboard():
    update_leaderboard()
    # Sorts the teams by their now updated standing to output as a list repreenting the leaderboard
    leaderboard = list(teams_collection.find({}, {"_id": 0, "team_id": 1, "total_team_points": 1, "team_standing": 1}).sort("team_standing", 1))
    
    return jsonify({"leaderboard": leaderboard})

if __name__ == "__main__":
    app.run(debug=True)