"""Demo app using SQLAlchemy."""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, User, Post, Tag, PostTag
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
    tags = Tag.sorted_query()

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
    tags = Tag.sorted_query()
    return render_template("/new_post.html", user=user, tags=tags)

@app.route("/users/<int:user_id>/posts/new", methods=["POST"])
def add_post(user_id):

    post_title = request.form.get('post_title')
    post_content = request.form.get('post_content')
    post_tags = request.form.getlist('tags')
    tags = Tag.query.filter(Tag.id.in_(post_tags)).all()
    post = Post(title=post_title, content=post_content, user_id=user_id)
    for tag in tags:
        post.tags.append(tag)
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
    tags = Tag.sorted_query()
    return render_template('/edit_post.html', post=post, tags=tags)

@app.route('/posts/<int:post_id>/edit', methods=["POST"])
def edit_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.title = request.form.get('post_title')
    post.content = request.form.get('post_content')

    # Get current tag IDs from the form as integers
    current_tag_ids = list(map(int, request.form.getlist('tags')))
    # Get tag objects for the current tags
    current_tags = Tag.query.filter(Tag.id.in_(current_tag_ids)).all()

    # Add new tags and remove unselected tags
    post.tags = [tag for tag in current_tags if tag not in post.tags] + \
                [tag for tag in post.tags if tag.id in current_tag_ids]

    # Assuming 'post.user_id' is valid and 'User' is the user model
    user = User.query.get_or_404(post.user_id)

    # No need to add 'post' to the session as it's already tracked by SQLAlchemy
    try:
        db.session.commit()
        return redirect(f"/posts/{post_id}")
    except Exception as e:
        db.session.rollback()  
        return str(e), 500  


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

@app.route("/tags")
def show_tags():
    """List all tags."""

    tags = Tag.sorted_query()
    return render_template("tags.html", tags=tags)

@app.route("/tags/<int:tag_id>")
def show_tag_details(tag_id):
    # post = Post.query.get_or_404(post_id)
    # user= User.query.get_or_404(post.user_id)
    tag = Tag.query.get_or_404(tag_id)
    posts = tag.posts
    
    return render_template('/tag_detail.html', tag=tag, posts=posts)

@app.route("/tags/new")
def show_add_new_tag():
    posts = Post.query.all()

    return render_template('/new_tag.html', posts=posts)
    

@app.route("/tags/new", methods=["POST"])
def handle_add_new_tag():
    tag_name = request.form.get('tag_name')
    tag_posts = request.form.getlist('posts')

    tag = Tag(name=tag_name)

    
    posts = Post.query.filter(Post.id.in_(tag_posts)).all()
    for post in posts:
        tag.posts.append(post)


    db.session.add(tag)
    db.session.commit()
    return redirect(f"/tags")

@app.route("/tags/<int:tag_id>/edit")
def show_edit_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    posts = Post.query.all()
    return render_template('/edit_tag.html', tag=tag, posts=posts)

@app.route("/tags/<int:tag_id>/edit", methods=["POST"])
def handle_edit_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    tag.name = request.form.get('tag_name')

    current_post_ids = list(map(int, request.form.getlist('posts')))
    current_posts = Post.query.filter(Post.id.in_(current_post_ids)).all()

    # Add new tags and remove unselected tags
    tag.posts = [post for post in current_posts if post not in tag.posts] + \
                [post for post in tag.posts if post.id in current_post_ids]


    #db.session.add(tag)
    try:
        db.session.commit()
        return redirect(f"/tags/{tag_id}")
    except Exception as e:
        db.session.rollback() 
        return str(e), 500

@app.route("/tags/<int:tag_id>/delete", methods=["POST"])
def handle_delete_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    db.session.delete(tag)
    db.session.commit()
    flash('Tag deleted successfully!', 'success')

    return redirect(f"/tags")