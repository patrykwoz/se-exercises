"""Demo file showing off a model for SQLAlchemy."""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
import pytz

db = SQLAlchemy()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

def default_img_url():
    return "https://images.unsplash.com/photo-1599272771314-f3ec16bda3f2?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"


class User(db.Model):
    """User."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False, unique=False)
    last_name = db.Column(db.String(50), nullable=False, unique=False)
    user_type = db.Column(db.String(10), nullable=False, unique=False, default='admin')
    img_url = db.Column(db.String(255), nullable=False, default=default_img_url)

    def __repr__(self):
        """Show info about user."""

        u = self
        return f"<User {u.id} {u.first_name} {u.last_name} {u.user_type}>"

    @classmethod
    def get_by_type(cls, type):
        """Get all user matching that type/permissions."""

        return cls.query.filter_by(type=type).all()
    
    @property
    def full_name(self):
        """Return the full name of the user."""
        return f"{self.first_name} {self.last_name}"
    
    @classmethod
    def sorted_query(self):
        return self.query.order_by(self.first_name, self.last_name).all()
        
#Cute dog
#https://images.unsplash.com/photo-1548253172-369bc1121857?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D


class Post(db.Model):
    """Post."""

    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50), nullable=False, unique=False)
    content = db.Column(db.String(150), nullable=False, unique=False)
    date =datetime.utcnow()
    created_at = db.Column(db.DateTime, default=date)
    local_tz = pytz.timezone('America/New_York')
    local_time = date.replace(tzinfo=timezone.utc).astimezone(local_tz)
    formatted_time = local_time.strftime('%A %B %d, %Y, %I:%M %p')
    created_at_friendly = db.Column(db.String(150), nullable=False, unique=False, default=formatted_time)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))

    user = db.relationship('User')

    def __repr__(self):
        post_user_info = f"user:{self.user.full_name} id:{self.user_id}" if self.user else "<no associated user>"
        return f"<Post {self.title} created by {post_user_info}.>"