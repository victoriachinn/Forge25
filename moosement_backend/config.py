import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

user = quote_plus(os.getenv("MONGO_USER"))
password = quote_plus(os.getenv("MONGO_PASS"))
MONGO_URI = f"mongodb+srv://{user}:{password}@moosement.lnn1d.mongodb.net/?appName=Moosement"

if not user or not password:
    raise ValueError("MONGO_USER or MONGO_PASS not found in environment variables")
