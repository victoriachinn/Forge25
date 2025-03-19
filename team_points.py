from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
teams_collection = db["team_data"]

# API route to get the number of total points for a team
@app.route("/api/team/points", methods=["GET"])
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

if __name__ == "__main__":
    app.run(debug=True)


