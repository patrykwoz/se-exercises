"""Flask app for Cupcakes"""
from flask import Flask, request, redirect, render_template, flash
from werkzeug.utils import secure_filename
from models import db, connect_db, Pet
from forms import PetForm
import pdb
import os



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///pet_adoption_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

BASE_DIR = '/static'
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
MAX_CONTENT_LENGTH = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

connect_db(app)

app.config['SECRET_KEY'] = "SECRET!"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

@app.route("/")
def render_home():
    pets = Pet.sorted_query()
    return render_template('/home.html', pets=pets)