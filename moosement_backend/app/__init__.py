# app.py
from flask import Flask
from flask_cors import CORS
from app.challenges import challenges_bp  # Import the challenges blueprint
from app.users import users_bp  # Example of another blueprint for user-related routes
from app.teams import teams_bp  # Example of another blueprint for team-related routes
from app.rewards import rewards_bp # Example of another blueprint for rewards-related routes


def create_app():
    """
    Initializes and configures the Flask application.
    Registers all necessary blueprints.
    """
    
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend communication

    # Register the Blueprint for challenges
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')

    app.register_blueprint(rewards_bp, url_prefix='/api/rewards')

    # Register the Blueprint for users (if you have one)
    app.register_blueprint(users_bp, url_prefix='/api/users')

    # Register the Blueprint for teams (if you have one)
    app.register_blueprint(teams_bp, url_prefix='/api/teams')

    # Register any additional blueprints here
    # e.g., app.register_blueprint(other_bp, url_prefix='/api/other')

    return app
