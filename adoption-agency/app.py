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

@app.route("/add", methods=["GET", "POST"])
def add_pet():
    form = PetForm()
    if form.validate_on_submit():
        
        form_data = form.data
        f = form.photo_upload.data
        filename = secure_filename(f.filename)
        photo_path = os.path.join(app.root_path, 'static/uploads', filename)
        photo_url = f"static/uploads/{filename}"
        f.save(photo_path)
        form_data['available'] = form.available.data == 'True'
        if form_data['photo_upload']:
            form_data['photo_url'] = photo_url

        exclude_fields = ['csrf_token', 'photo_upload']
        pet_data = {key: value for key, value in form_data.items() if key not in exclude_fields}

        pet = Pet(**pet_data)
        db.session.add(pet)
        db.session.commit()

        flash(f"Created new pet: name is {form.name.data}, species is {form.species.data}, age is {form.age.data}.")
        return redirect('/')
    return render_template("add_pet.html", form=form)



@app.route("/pets/<int:pet_id>/edit", methods=["GET", "POST"])
def edit_pet(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    form = PetForm(obj=pet)

    if form.validate_on_submit():
        form.available.data = form.available.data == 'True'
        form.populate_obj(pet)
        db.session.commit() 
        flash(f"Succesfully edited the pet: name is {pet.name}, species is {pet.species}, age is {pet.age}.")
        return redirect('/')
    
    return render_template("edit_pet.html", form=form)




@app.route("/pets/<int:pet_id>/delete", methods=["POST"])
def delete_pet(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    db.session.delete(pet)
    db.session.commit()
    flash('Pet deleted successfully!', 'success')
    return redirect(f"/")
