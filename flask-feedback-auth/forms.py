from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from werkzeug.utils import secure_filename
from wtforms import StringField, FloatField, BooleanField, IntegerField, URLField, SelectField, TextAreaField, PasswordField, EmailField
from wtforms.validators import InputRequired, Optional, Email, NumberRange, ValidationError

class RegisterForm(FlaskForm):
    """Form for registering a user."""

    username = StringField("Username", validators=[InputRequired(message="Input a valid username")])
    password = PasswordField("Password", validators=[InputRequired(message="Input a valid password")])
    email = EmailField("Email", validators=[InputRequired(message="Input a valid email"),Email()])
    first_name = StringField("First Name", validators=[InputRequired(message="Input a valid first name")])
    last_name = StringField("Last Name", validators=[InputRequired(message="Input a valid last name")])
    

class LoginForm(FlaskForm):
    """Form for loging in a user."""

    username = StringField("Username", validators=[InputRequired(message="Input a valid username")])
    password = PasswordField("Password", validators=[InputRequired(message="Input a valid password")])

class FeedbackForm(FlaskForm):
    """Form for adding feedback by a user."""
    title = StringField("Title", validators=[InputRequired(message="Input a valid title")])
    content = TextAreaField("Content", validators=[InputRequired(message="Input a valid content")])

class ResetPasswordForm(FlaskForm):
    """Form for reseting password by a user."""
    email = EmailField("Email", validators=[InputRequired(message="Input a valid email"),Email()])

class SetPasswordForm(FlaskForm):
    """Form for settingg password by a user with a token."""
    password = PasswordField("New Password", validators=[InputRequired(message="Input a valid password")])