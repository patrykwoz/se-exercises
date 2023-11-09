"""Demo file showing off a model for SQLAlchemy."""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
import pytz
from sqlalchemy import desc

db = SQLAlchemy()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

def default_photo_url():
    return "https://images.unsplash.com/photo-1599272771314-f3ec16bda3f2?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"


class Pet(db.Model):
    """Pet."""
    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=False)
    species = db.Column(db.String(50), nullable=False, unique=False)
    photo_url = db.Column(db.String(255), nullable=False, default=default_photo_url)
    age = db.Column(db.Integer, nullable=False, unique=False)
    notes = db.Column(db.String(500), nullable=False, unique=False, default='Description placeholder - please populate')
    available =db.Column(db.Boolean, nullable=False, unique=False, default=True)
    

    def __repr__(self):
        """Show info about pet."""

        pet = self
        return f"<Pet {pet.id} name={pet.name} species={pet.species} age={pet.age} available={pet.available}>"

    @classmethod
    def get_by_species(cls, species):
        """Get all pets of the same speecies."""

        return cls.query.filter_by(species=species).all()
    
    @classmethod
    def sorted_query(self):
        return self.query.order_by(desc(self.available), desc(self.name)).all()
        
# class Post(db.Model):
#     """Post."""

#     __tablename__ = "posts"

#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     title = db.Column(db.String(50), nullable=False, unique=False)
#     content = db.Column(db.String(150), nullable=False, unique=False)
#     date =datetime.utcnow()
#     created_at = db.Column(db.DateTime, default=date)
#     local_tz = pytz.timezone('America/New_York')
#     local_time = date.replace(tzinfo=timezone.utc).astimezone(local_tz)
#     formatted_time = local_time.strftime('%A %B %d, %Y, %I:%M %p')
#     created_at_friendly = db.Column(db.String(150), nullable=False, unique=False, default=formatted_time)
    
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))

#     user = db.relationship('User')

#     def __repr__(self):
#         post_user_info = f"user:{self.user.full_name} id:{self.user_id}" if self.user else "<no associated user>"
#         return f"<Post {self.title} created by {post_user_info}.>"

# class Tag(db.Model):
#     """Tag."""
#     __tablename__="tags"

#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     name = db.Column(db.String(50), nullable=False, unique=True)
#     posts = db.relationship('Post', secondary='posts_tags', backref='tags')

#     @classmethod
#     def sorted_query(self):
#         return self.query.order_by(self.name).all()

# class PostTag(db.Model):
#     """PostTagg."""
#     __tablename__="posts_tags"

#     post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), primary_key=True)
#     tag_id = db.Column(db.Integer, db.ForeignKey("tags.id"), primary_key=True)

