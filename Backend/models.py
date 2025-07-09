import os
from sqlalchemy import create_engine, String, DateTime, Column
from dotenv import load_dotenv
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime
import bcrypt
from pydantic import BaseModel

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

class PasswordResetForm(BaseModel):
    email :str
    old_password :str
    password :str
    confirm_password :str

class Base(DeclarativeBase):
    pass

class Users(Base):
    __tablename__ = 'users'

    email_id = Column(String, unique=True, nullable=False, primary_key=True)  # Ensure uniqueness
    hashed_password = Column(String, nullable=False)
    last_login = Column(DateTime, default=datetime.now)

    def check_password(self,password):
        return bcrypt.checkpw(password.encode(),self.hashed_password.encode())
    
engine = create_engine(DB_URL)

if __name__ == '__main__':
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)