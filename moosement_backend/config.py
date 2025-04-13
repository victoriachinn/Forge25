from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="mongo.env")
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI not found in environment variables")