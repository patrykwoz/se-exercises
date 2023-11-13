"""Models for Cupcake app."""
from flask_sqlalchemy import SQLAlchemy
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


class Cupcake(db.Model):
    """Cupcake."""
    __tablename__ = "cupcakes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.String(50), nullable=False, unique=False)
    size = db.Column(db.String(50), nullable=False, unique=False)
    rating = db.Column(db.Float, nullable=False, unique=False)
    image = db.Column(db.String(255), nullable=False, default=default_image)

    

    def __repr__(self):
        """Show info about cupcake."""

        cupcake = self
        return f"<Cupcake {cupcake.id} flavor={cupcake.flavor} size={cupcake.size} rating={cupcake.rating}>"
    
    def serialize(self):
        """Serialize cupcake into a dictionary"""
        serialized_cupcake = {
            "id":self.id,
            "flavor":self.flavor,
            "size":self.size,
            "rating":self.rating,
            "image":self.image
        }
        return serialized_cupcake

    @classmethod
    def get_by_flavor(cls, flavor):
        """Get all cupcakes of the same flavor."""

        return cls.query.filter_by(flavor=flavor).all()
    
    @classmethod
    def sorted_query(self):
        return self.query.order_by(desc(self.flavor), desc(self.size)).all()