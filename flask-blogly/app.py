"""Demo app using SQLAlchemy."""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, User
import pdb


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

app.config['SECRET_KEY'] = "SECRET!"

@app.route("/")
def render_home():
    return redirect('/users')

@app.route("/users")
def list_users():
    """List all users."""

    users = User.sorted_query()
    return render_template("users.html", users=users)

@app.route("/users/new")
def render_new_user():

    return render_template("/new_user.html")

@app.route("/users/new", methods=["POST"])
def add_user():
    """Add user and redirect to all users."""

    first_name = request.form['first_name']
    last_name = request.form['last_name']
    user_type = request.form['user_type']
    img_url = request.form['img_url']

    user = User(first_name=first_name, last_name=last_name, user_type=user_type, img_url=img_url)
    db.session.add(user)
    db.session.commit()

    return redirect(f"/users")


@app.route("/users/<int:user_id>")
def show_user_details(user_id):
    """Show info on a single user."""

    user = User.query.get_or_404(user_id)
    return render_template("detail.html", user=user)

@app.route("/users/<int:user_id>/edit")
def render_edit_user(user_id):
    user = User.query.get_or_404(user_id)
    return render_template("/edit_user.html", user=user)

@app.route("/users/<int:user_id>/edit", methods=["POST"])
def edit_user(user_id):
    """Edit user."""
    user= User.query.get_or_404(user_id)

    user.first_name = request.form.get('first_name')
    user.last_name = request.form.get('last_name')
    user.user_type = request.form.get('user_type')
    user.img_url = request.form.get('img_url')

    db.session.commit()

    return redirect(f"/users")

@app.route('/users/<int:user_id>/cancel')
def handle_cancel(user_id):
    #pdb.set_trace()

    return redirect(f"/users/{user_id}")

@app.route("/users/<int:user_id>/delete", methods=["POST"])
def delete_user(user_id):
    user= User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    flash('User deleted successfully!', 'success')

    return redirect("/users")