"""Seed file to make sample data for pets db."""

from models import db, Pet
#from app import app
#import app

# Create all tables
db.drop_all()
db.create_all()

# If table isn't empty, empty it
Pet.query.delete()

# Add pets
mack = Pet(name='Mack', species='beaver', age=18, photo_url="https://images.unsplash.com/photo-1590586186864-6ca0cff58786?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
ryan = Pet(name='Ryan', species='polar bear', age=35, photo_url="https://images.unsplash.com/photo-1579019243425-9d0c34914e38?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
elizabeth = Pet(name='Queen', species='fox', age=1, photo_url="https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")

# Add new objects to session, so they'll persist
db.session.add_all([mack, ryan, elizabeth])

# Commit--otherwise, this never gets saved!
db.session.commit()
