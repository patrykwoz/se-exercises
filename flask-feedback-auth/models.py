"""Models for the Flask Feedback app."""
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime, timezone
#import pytz
from sqlalchemy import desc

db = SQLAlchemy()
bcrypt = Bcrypt()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

class User(db.Model):
    """User."""
    __tablename__ = "users"

    username = db.Column(db.String(255), primary_key=True, unique=True)
    password = db.Column(db.String(500), nullable=False, unique=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String(255), nullable=False, unique=False)
    last_name = db.Column(db.String(255), nullable=False, unique=False)
    reset_token = db.Column(db.String(500), nullable=True, unique=False)

    

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

    def reset_password(self, password):
        """Reset user password"""
        hashed = bcrypt.generate_password_hash(password)
        # turn bytestring into normal (unicode utf8) string
        hashed_utf8 = hashed.decode("utf8")
        self.password=hashed_utf8


    @classmethod
    def sorted_query(self):
        return self.query.order_by(desc(self.last_name), desc(self.first_name)).all()

    @classmethod
    def register(cls, username, password, email, first_name, last_name):
        """Register user w/hashed password & return user."""

        hashed = bcrypt.generate_password_hash(password)
        # turn bytestring into normal (unicode utf8) string
        hashed_utf8 = hashed.decode("utf8")

        # return instance of user w/username and hashed pwd
        return cls(username=username, password=hashed_utf8, email=email, first_name=first_name, last_name=last_name)
    

    @classmethod
    def authenticate(cls, username, password):
        """Validate that user exists & password is correct.

        Return user if valid; else return False.
        """

        u = User.query.filter_by(username=username).first()

        if u and bcrypt.check_password_hash(u.password, password):
            # return user instance
            return u
        else:
            return False

class Feedback(db.Model):
    """Feedback."""
    __tablename__ = "feedbacks"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False, unique=True)
    content = db.Column(db.String(500), nullable=False, unique=False)
    username = db.Column(db.String, db.ForeignKey('users.username'))

    user = db.relationship('User', backref="feedbacks")

    def __repr__(self):
        """Show info about the feedback."""

        feedback = self
        return f"<Feedback {feedback.title} content={feedback.content} user={feedback.username}>"
    
    def serialize(self):
        """Serialize feedback into a dictionary"""
        serialized = {
            "id":self.id,
            "title":self.title,
            "content":self.content,
            "user":self.user.username,
        }
        return serialized
    
    @classmethod
    def sorted_query(self):
        return self.query.order_by(desc(self.title)).all()