from models import Users
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
engine = create_engine(DB_URL)

obj = Users(
    email_id = 'ABC@abc.com',
    hashed_password = bcrypt.hashpw('1234*5'.encode(), bcrypt.gensalt()).decode()
)

session = sessionmaker(bind=engine)
Session = session()

Session.add(obj)
Session.commit()