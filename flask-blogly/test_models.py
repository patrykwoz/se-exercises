from unittest import TestCase

from sqlalchemy.orm import sessionmaker
from app import app
from models import db, User

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///test_blogly_db'
app.config['SQLALCHEMY_ECHO'] = False

ctx = app.app_context()
ctx.push()
engine = db.engine
connection = engine.connect()

Session = sessionmaker(bind=engine)
session = Session()

db.drop_all()
db.create_all()

class UserModelTestCase(TestCase):
    """Tests for model for Users."""

    def setUp(self):
        """Clean up any existing users."""

        User.query.delete()

        img_url = "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        self.img_url = img_url

    def tearDown(self):
        """Clean up any fouled transaction."""

        db.session.rollback()

    def test_fullname(self):
        user = User(first_name="TestUser", last_name="TestLastName", user_type="testuser", img_url=self.img_url)
        self.assertEquals(user.full_name, "TestUser TestLastName")