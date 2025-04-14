from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
#from config import MONGO_URI
import certifi
# Create a new client and connect to the server
client = MongoClient("mongodb+srv://riyaroy:00nYOJ2AX6GWstYA@moosement.lnn1d.mongodb.net/?appName=Moosement", server_api=ServerApi('1'), tls=True, tlsCAFile=certifi.where())
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print(client.list_database_names())
    print(client["moosement"].list_collection_names())
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)