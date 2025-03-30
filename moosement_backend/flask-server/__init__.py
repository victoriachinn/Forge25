from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from config import config

# Import route modules
from create_account import create_account_bp
from teams import teams_bp

def create_app():
    """
    Initializes and configures the Flask application.
    """
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend communication

    # Database Connection
    client = MongoClient(config.MONGO_URI)
    app.db = client["moosement"]  # Attach the database to the app instance

    # Register Blueprints
    app.register_blueprint(create_account_bp, url_prefix="/api/account")
    app.register_blueprint(teams_bp, url_prefix="/api/teams")

    return app
