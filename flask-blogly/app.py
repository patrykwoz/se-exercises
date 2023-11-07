"""Demo app using SQLAlchemy."""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, User, Post
import pdb



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

app.config['SECRET_KEY'] = "SECRET!"

@app.route("/")
def render_home():

    posts = Post.query.all()

    return render_template('/home.html', posts=posts)

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
    posts= Post.query.filter_by(user_id=user_id).all()
    user = User.query.get_or_404(user_id)
    return render_template("detail.html", user=user, posts=posts)

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

@app.route("/users/<int:user_id>/posts/new")
def render_new_post(user_id):
    user = User.query.get_or_404(user_id)
    return render_template("/new_post.html", user=user)

@app.route("/users/<int:user_id>/posts/new", methods=["POST"])
def add_post(user_id):

    post_title = request.form.get('post_title')
    post_content = request.form.get('post_content')

    post = Post(title=post_title, content=post_content, user_id=user_id)
    db.session.add(post)
    db.session.commit()
    return redirect(f"/users/{user_id}")


@app.route('/users/<int:user_id>/posts/cancel')
def handle_post_cancel(user_id):

    return redirect(f"/users/{user_id}")

@app.route('/posts/<int:post_id>')
def render_post_detail(post_id):

    post = Post.query.get_or_404(post_id)
    user= User.query.get_or_404(post.user_id)
    
    return render_template('/post_detail.html', post=post, user=user)

@app.route('/posts/<int:post_id>/edit')
def render_edit_post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('/edit_post.html', post=post)

@app.route('/posts/<int:post_id>/edit', methods=["POST"])
def edit_post(post_id):

    post = Post.query.get_or_404(post_id)
    post.title = request.form.get('post_title')
    post.content = request.form.get('post_content')
    user= User.query.get_or_404(post.user_id)
    db.session.add(post)
    db.session.commit()
    
    return redirect(f"/posts/{post_id}")

@app.route('/posts/<int:post_id>/cancel')
def cancel_edit_post(post_id):
    return redirect(f"/posts/{post_id}")


@app.route("/posts/<int:post_id>/delete", methods=["POST"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    user_id = post.user_id
    db.session.delete(post)
    db.session.commit()
    flash('Post deleted successfully!', 'success')

    return redirect(f"/users/{user_id}")