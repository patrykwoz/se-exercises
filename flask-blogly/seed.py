"""Seed file to make sample data for users db."""

from models import User, db
#from app import app
#import app

# Create all tables
db.drop_all()
db.create_all()

# If table isn't empty, empty it
User.query.delete()

# Add users
mack = User(first_name='Mack', last_name='Mackowsky', user_type="admin", img_url="https://images.unsplash.com/photo-1590586186864-6ca0cff58786?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
ryan = User(first_name='Ryan', last_name='TheBear', user_type="admin", img_url="https://images.unsplash.com/photo-1579019243425-9d0c34914e38?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
elizabeth = User(first_name='Queen', last_name='Elizabeth', user_type="royal", img_url="https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")

# Add new objects to session, so they'll persist
db.session.add(mack)
db.session.add(ryan)
db.session.add(elizabeth)

# Commit--otherwise, this never gets saved!
db.session.commit()
