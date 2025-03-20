from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
challenges_collection = db["challenges"]

# API route to get challenges
@app.route("/challenges", methods=["GET"])
def get_challenges():
    challenges_list = list(challenges_collection.find({}, {"_id": 0}))
    return jsonify({"challenges": challenges_list})

if __name__ == "__main__":
    app.run(debug=True)
