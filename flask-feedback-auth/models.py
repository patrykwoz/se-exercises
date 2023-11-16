"""Models for the Flask Feedback app."""
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime, timezone
#import pytz
from sqlalchemy import desc

db = SQLAlchemy()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

def default_image():
    return "https://thestayathomechef.com/wp-content/uploads/2017/12/Most-Amazing-Chocolate-Cupcakes-1-small.jpg"


class User(db.Model):
    """User."""
    __tablename__ = "users"

    username = db.Column(db.String(50), primary_key=True, unique=True)
    password = db.Column(db.String(50), nullable=False, unique=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String(255), nullable=False, unique=False)
    last_name = db.Column(db.String(255), nullable=False, unique=False)

    

    def __repr__(self):
        """Show info about the user."""

        user = self
        return f"<User {user.username} email={user.email} first name={user.first_name} last name={user.last_name}>"
    
    def serialize(self):
        """Serialize user into a dictionary"""
        serialized_user = {
            "username":self.username,
            "email":self.email,
            "first_name":self.first_name,
            "last_name":self.last_name,
        }
        return serialized_user
    
    @classmethod
    def sorted_query(self):
        return self.query.order_by(desc(self.last_name), desc(self.first_name)).all()