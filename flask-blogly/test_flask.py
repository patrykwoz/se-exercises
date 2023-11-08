from unittest import TestCase
from sqlalchemy.orm import sessionmaker
from app import app
from models import db, User, Post, Tag, PostTag
import pdb

# Constants
TEST_DB_URI = 'postgresql:///test_blogly_db'
IMG_URL = "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"


def configure_app():
    """Configure Flask application."""
    app.config['SQLALCHEMY_DATABASE_URI'] = TEST_DB_URI
    app.config['SQLALCHEMY_ECHO'] = False
    app.config['TESTING'] = True
    app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


def init_db(cls):
    """Initialize the database."""
    with app.app_context():
        engine = db.engine
        connection = engine.connect()
        cls.session = sessionmaker(bind=db.engine)()
        db.drop_all()
        db.create_all()


class UserViewsTestCase(TestCase):
    """Tests for views for Users."""

    @classmethod
    def setUpClass(cls):
        """Run once before all test methods."""
        configure_app()
        init_db(cls)
        
        

    def setUp(self):
        """Add sample user."""
        with app.app_context():
            User.query.delete()
            Post.query.delete()

            user = User(first_name="Mack III", last_name="TheBear", user_type="user", img_url=IMG_URL)
            post = Post(title="Test Title", content="Test Content", user=user)

            db.session.add_all([user, post])
            db.session.commit()

            self.user = user
            self.user_id = user.id
            self.post_id = post.id

    def tearDown(self):
        """Clean up any fouled transaction."""
        with app.app_context():
            db.session.rollback()

    @classmethod
    def tearDownClass(cls):
        """Run once after all test methods."""
        cls.session.close()

    def test_list_users(self):
        with app.test_client() as client:
            resp = client.get("/users", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('Mack III', html)


    def test_show_user(self):
        with app.test_client() as client:
            resp = client.get(f"/users/{self.user_id}")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<h3>Mack III TheBear</h3>', html)

    def test_add_user(self):
        with app.test_client() as client:
            d = {'first_name':"Mack IV", 'last_name':"TheBear", 'user_type':"user", 'img_url':IMG_URL}
            resp = client.post("/users/new", data=d, follow_redirects=True)
            html = resp.get_data(as_text=True)
            #pdb.set_trace()
            self.assertEqual(resp.status_code, 200)
            self.assertIn("Mack IV", html)
    def test_delete_user(self):
        with app.test_client() as client:
            resp = client.post(f"/users/{self.user_id}/delete", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('User deleted successfully!', html)
    def test_add_post(self):
        with app.test_client() as client:
            d = {'post_title':"My Post", 'post_content':"My Content", 'user':self.user}
            resp = client.post("/users/1/posts/new", data=d, follow_redirects=True)
            html = resp.get_data(as_text=True)
            #pdb.set_trace()
            self.assertEqual(resp.status_code, 200)
            self.assertIn("My Post", html)
    def test_add_tag(self):
        with app.test_client() as client:
            d = {'tag_name':"animals"}
            resp = client.post("/tags/new", data=d, follow_redirects=True)
            html = resp.get_data(as_text=True)
            #pdb.set_trace()
            self.assertEqual(resp.status_code, 200)
            self.assertIn("animals", html)
