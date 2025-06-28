from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from db_models import Users
from pydantic import BaseModel
from typing import Annotated
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from database import SessionLocal

load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=["auth"]
)

class NewUserRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

hash_context = CryptContext(schemes=['bcrypt'], deprecated = 'auto')

ouath2bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=Token)
async def create_new_user(db: db_dependency, user: NewUserRequest):
    existing_user = db.query(Users).filter(Users.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken :(")
    new_user = Users(username = user.username, hashed_password = hash_context.hash(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    new_token = generate_token(new_user.username, new_user.id, timedelta(days=15))
    return Token(access_token=new_token, token_type="bearer")

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not hash_context.verify(password, user.hashed_password):
        return False
    return user

def generate_token(username: str, user_id: int, time_limit: timedelta):
    expiry = datetime.utcnow() + time_limit
    to_encode = {
        "sub": username,
        "id": user_id,
        "exp": expiry
    }
    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token

@router.post('/token', response_model=Token)
async def user_login_to_get_token(credentials: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(credentials.username, credentials.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
    jwt_token = generate_token(user.username, user.id, timedelta(days=15))
    print("user verified")
    return Token(access_token=jwt_token, token_type="bearer")

async def verify_token_and_get_current_user(token: Annotated[str, Depends(ouath2bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload["sub"]
        id = payload["id"]
        if username is None or id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
        return {"username": username, "id": id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")