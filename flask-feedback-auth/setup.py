from sqlalchemy.orm import sessionmaker

ctx = app.app_context()
ctx.push()
engine = db.engine
connection = engine.connect()

Session = sessionmaker(bind=engine)
session = Session()