"""Flask app for user feedback"""
from flask import Flask, request, redirect, render_template, flash, jsonify, make_response, session, abort
from flask_mail import Message, Mail
from werkzeug.utils import secure_filename
from models import db, connect_db, User, Feedback
from forms import RegisterForm, LoginForm, FeedbackForm, ResetPasswordForm, SetPasswordForm
from sqlalchemy.exc import IntegrityError
from secrets import token_urlsafe

import pdb
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///flask_feedback_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

app.config['SECRET_KEY'] = "SECRET!"

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'provide@email.com'
app.config['MAIL_PASSWORD'] = 'provide password'

mail = Mail(app)

@app.route("/")
def render_home():
    users = User.sorted_query()
    return render_template("home.html", users=users)

@app.route("/register", methods=["GET", "POST"])
def register_user():
    form = RegisterForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        email = form.email.data
        first_name = form.first_name.data
        last_name = form.last_name.data
        new_user = User.register(username, password, email, first_name, last_name)

        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            form.username.errors.append('Username taken.  Please pick another')
            return render_template('register.html', form=form)
        session['user_id'] = new_user.username
        flash('Welcome! Successfully Created Your Account!', "success")
        return redirect(f'/users/{username}')

    return render_template('register.html', form=form)

@app.route("/login", methods=["GET", "POST"])
def login_user():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        try:
            user = User.authenticate(username, password)
            session['user_id'] = user.username
            flash(f'Welcome back, {user.first_name}!', "success")
            
        except:
            form.username.errors.append('Invalid username/password')
            return render_template('login.html', form=form)        
        
        return redirect(f'/users/{username}')

    return render_template('login.html', form=form)

@app.route("/logout")
def logout():
    if "user_id" not in session:
        flash("You're not logged in! You shouldn't be here.", "danger")
        return redirect('/')
    session.pop('user_id')
    flash("Goodbye!", "info")
    return redirect('/')

@app.route("/users/<username>")
def user_info(username):
    if "user_id" not in session:
        flash("Please login first!", "danger")
        return redirect('/')
    if username != session['user_id']:
        flash("You don't have permissions to edit other users!", "danger")
        return redirect(f"/users/{session['user_id']}")
    
    user = User.query.filter_by(username=username).first()

    return render_template("user_info.html", user=user)

@app.route("/users/<username>/delete", methods=["POST"])
def delete_user(username):
    if "user_id" not in session:
        flash("Please login first!", "danger")
        return redirect('/')
    if username != session['user_id']:
        flash("You don't have permissions to edit other users!", "danger")
        return redirect(f"/users/{session['user_id']}")

    user = User.query.filter_by(username=username).first()
    try:
        db.session.delete(user);
        db.session.commit();
        session.pop('user_id')
        flash(f"You have succesfully deleted user: {username}", "info")

    except:
        flash("Something went wrong, perhaps you're trying to delete a user that doesn't exist", "danger")

    return redirect('/')

@app.route("/users/<username>/feedback/add", methods=["GET", "POST"])
def add_feedback(username):
    if "user_id" not in session:
        flash("Please login first!", "danger")
        return redirect('/')
    if username != session['user_id']:
        flash("You don't have permissions to edit other users!", "danger")
        return redirect(f"/users/{session['user_id']}")
    
    form = FeedbackForm()
    user = User.query.filter_by(username=username).first()

    if form.validate_on_submit():
        title = form.title.data
        content = form.content.data
        new_feedback = Feedback(
            title=title,
            content=content,
            username=username
            )
        db.session.add(new_feedback)
        try:
            db.session.commit()
        except:
            flash('Something went wrong, try again.')
            return redirect(f'/users/{username}/feedback/add')
        flash('Succesfully added your feedback!', "success")
        return redirect(f'/users/{username}')

    return render_template("add_feedback.html", form=form)

@app.route("/feedback/<feedback_id>/update", methods=["GET", "POST"])
def update_feedback(feedback_id):
    if "user_id" not in session:
        flash("Please login first!", "danger")
        return redirect('/')
    feedback = Feedback.query.filter_by(id=feedback_id).first()
    username = feedback.user.username
    user = User.query.filter_by(username=username).first()
    if username != session['user_id']:
        flash("You don't have permissions to edit other users!", "danger")
        return redirect(f"/users/{session['user_id']}")
    
    form = FeedbackForm()
    form.process(obj=feedback)

    if form.validate_on_submit():
        title = form.title.data
        content = form.content.data
        feedback.title = title
        feedback.content = content
        try:
            db.session.commit()
        except:
            flash('Something went wrong, try again.')
            return redirect(f'/users/{username}/feedback/update')
        flash('Succesfully edited your feedback!', "success")
        return redirect(f'/users/{username}')

    return render_template("edit_feedback.html", form=form)
    
@app.route("/feedback/<feedback_id>/delete", methods=["POST"])
def delete_feedback(feedback_id):
    feedback = Feedback.query.filter_by(id=feedback_id).first()
    username = feedback.user.username

    check_if_user_authorized_or_authenticated(username)

    user = User.query.filter_by(username=username).first()

    try:
        db.session.delete(feedback);
        db.session.commit();
        flash(f"You have succesfully deleted feedback: {feedback.title}", "info")

    except:
        flash("Something went wrong, perhaps you're trying to delete a user that doesn't exist", "danger")

    return redirect(f'/users/{username}')

@app.route("/resetpassword", methods=["GET", "POST"])
def reset_password():
    form = ResetPasswordForm()

    if form.validate_on_submit():
        email = form.email.data
        try:
            user = User.query.filter_by(email=email).first()
            token = token_urlsafe(32)
            user.reset_token = token
            
            db.session.commit()
            reset_link = f"{request.url_root}setpassword?email={user.email}&token={token}"
            msg = Message("Password Reset", sender="blueberry.beavers.mack@gmail.com", recipients=[user.email])
            msg.body = f"Click the following link to reset your password: {reset_link}"
            mail.send(msg)

            
        except:
            flash('Email not found. Please check the email address you provided.', "danger")
            return redirect(f'/login')
        flash('Password reset instructions sent to your email.', "info")
        return redirect(f'/login')

    return render_template('reset_password.html', form=form)
@app.route("/setpassword", methods=["GET", "POST"])
def set_password():
    form=SetPasswordForm()
    email = request.args.get("email")
    token = request.args.get("token")

    if form.validate_on_submit():
        new_password = form.password.data
        try:
            user = User.query.filter_by(email=email).first()
            user.reset_password(password)
            user.reset_token = ""
            db.session.commit()
            session['user_id'] = user.username
                        
        except:
            flash('Something went wrong', "danger")
            return redirect(f'/login')
        flash('Password reset succesful.', "info")
        return redirect(f'/login')


    return render_template("set_password.html", form=form)


@app.errorhandler(401)
def unauthorized(error):
    return render_template('401.html'), 401

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

def check_if_user_authorized_or_authenticated(username):
    if "user_id" not in session or username != session['user_id']:
        abort(401)