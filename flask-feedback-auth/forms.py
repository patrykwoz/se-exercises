from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from werkzeug.utils import secure_filename
from wtforms import StringField, FloatField, BooleanField, IntegerField, URLField, SelectField, TextAreaField
from wtforms.validators import InputRequired, Optional, Email, NumberRange, ValidationError

def validate_one_of(form, field):
    """Custom validator to ensure that either photo_url or photo_upload is provided, but not both."""
    if field.data and form.photo_url.data:
        raise ValidationError('Please provide either a photo URL or upload a photo, not both.')


class PetForm(FlaskForm):
    """Form for adding/editing pet."""

    name = StringField("Name", validators=[InputRequired(message="Input a valid name")])
    species = StringField("Species", validators=[InputRequired(message="Input a valid species")])
    photo_url = URLField("Photo URL", validators=[Optional(),validate_one_of])
    photo_upload = FileField(validators=[Optional(), FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!'), validate_one_of])
    age = IntegerField("Age", validators=[InputRequired(message="Input a valid whole number"), NumberRange(min=0, max=30, message="Age must be between 0 and 30.")] )
    available = SelectField("Availability", choices=[('True', 'Available'),  ('False', 'Not available')])
    notes = TextAreaField("Notes", validators=[Optional()])

