from pymongo import MongoClient

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"

#connects to MongoDB
client = MongoClient(MONGO_URI)

#chooses the database
db = client["moosement"]

#tests connection
#print("Connected to MongoDB:", db.list_collection_names())

#chooses collection to add to
users_collection = db["user_data"]

#sample user
new_user = {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "points": 100,
    "joined_date": "2025-02-19"
}

#inserts sample user document into MongoDB
insert_result = users_collection.insert_one(new_user)
