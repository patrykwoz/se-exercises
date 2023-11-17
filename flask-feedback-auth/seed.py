from app import app
from models import db, User, Feedback


with app.app_context():
    db.drop_all()
    db.create_all()

    user_one = User.register(username="mackTheGreat", password="iamgreat", email="mack@mack.com", first_name="Mack", last_name="Mackowsky")
    user_two = User.register(username="ryanTheBear", password="iambear", email="ryan@mack.com", first_name="Ryan", last_name="Polarbear")

    db.session.add_all([user_one, user_two])
    db.session.commit()

    feedback_one = Feedback(
    title="I am Great",
    content="I was always great",
    username="mackTheGreat"
    )
    feedback_two = Feedback(
    title="Ryan is O.K.",
    content="Sometimes lacking speed... and mumbles...",
    username="mackTheGreat"
    )
    db.session.add_all([feedback_one, feedback_two])
    db.session.commit()