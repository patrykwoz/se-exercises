"""Flask app for Cupcakes"""
from flask import Flask, request, redirect, render_template, flash, jsonify, make_response
from werkzeug.utils import secure_filename
from models import db, connect_db, User
#from forms import RegisterForm, LoginForm

#from forms import CupcakeForm
import pdb
import os



app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
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
    cupcakes = Cupcake.sorted_query()
    return render_template('/home.html', cupcakes=cupcakes)



# @app.route("/api/cupcakes")
# def get_all_cupcakes():
#     cupcakes = [ cupcake.serialize() for cupcake in Cupcake.sorted_query()]
#     return jsonify(cupcakes=cupcakes)

# @app.route("/api/cupcakes/<int:id>")
# def get_one_cupcake(id):
#     cupcake = Cupcake.query.filter_by(id=id).first().serialize()
#     return jsonify(cupcake=cupcake)

# @app.route("/api/cupcakes", methods=["POST"])
# def create_cupcake():
#     flavor=request.json["flavor"]
#     size=request.json["size"]
#     rating=request.json["rating"]
#     image=request.json["image"]

#     new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)

#     db.session.add(new_cupcake)
#     db.session.commit()

#     serialized = new_cupcake.serialize()

#     response = {
#         "cupcake":serialized
#     }

#     return (jsonify(response), 201)

# @app.route("/api/cupcakes/<int:id>", methods=["PATCH"])
# def update_cupcake(id):
#     cupcake = Cupcake.query.get_or_404(id)

#     cupcake.flavor=request.json["flavor"]
#     cupcake.size=request.json["size"]
#     cupcake.rating=request.json["rating"]
#     cupcake.image=request.json["image"]

#     db.session.add(cupcake)
#     db.session.commit()

#     serialized = cupcake.serialize()

#     response = {
#         "cupcake":serialized
#     }

#     return jsonify(response), 200

# @app.route("/api/cupcakes/<int:id>", methods=["DELETE"])
# def delete_cupcake(id):
#     cupcake = Cupcake.query.get_or_404(id)
#     db.session.delete(cupcake)
#     db.session.commit()
#     response = {
#         "message": f"Cupcake with id:{id} was succesfully deleted"
#     }
#     return jsonify(response), 200

