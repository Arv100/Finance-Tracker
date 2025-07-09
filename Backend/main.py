from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from models import Users, PasswordResetForm
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from pydantic import BaseModel

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
DB_URL = os.getenv("DATABASE_URL")
engine = create_engine(DB_URL)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:3000",  # React local development
    "http://127.0.0.1:3000",  # Alternative localhost address
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow only these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

class LoginData(BaseModel):
    email: str
    password: str

def get_db():
    session = sessionmaker(bind=engine)
    db = session()
    try:
        yield db
    finally:
        db.close()


def authenticate_user(db :Session,email :str, password :str):
    print(password)
    user = db.query(Users).filter(Users.email_id == email).first()
    if user and user.check_password(password):
        user.last_login = datetime.now()
        db.commit()
        return user
    return None


@app.get('/')
def index():
    return {"Data" : "LMS"}

@app.post('/reset_password')
def reset_password(reset_form :PasswordResetForm, db :Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email_id == reset_form.email).first()
    if user and user.check_password(reset_form.old_password):
        if reset_form.password == reset_form.confirm_password:
            user.hashed_password = user.set_password(reset_form.password)
            user.password_reset = datetime.now()
            db.commit()
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")

@app.post('/login')
def login(form_data :LoginData = Depends(), db :Session = Depends(get_db)):
    user = authenticate_user(db,form_data.email,form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    


if __name__ == '__main__':
    import uvicorn 
    uvicorn.run(app=app, reload=True, port=8000)