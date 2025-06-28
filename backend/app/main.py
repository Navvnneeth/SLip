from fastapi import FastAPI, Depends, HTTPException
from typing import Annotated
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from starlette import status
from fastapi.middleware.cors import CORSMiddleware
from auth import verify_token_and_get_current_user
import db_models
import auth
import receipts
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
app.include_router(auth.router)
app.include_router(receipts.router)

db_models.Base.metadata.create_all(bind = engine)

origins = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")]

allow_credentials = os.getenv("ALLOW_CREDENTIALS", "false").lower() == "true"

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(verify_token_and_get_current_user)]

@app.get("/", status_code=status.HTTP_202_ACCEPTED)
async def get_current_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed")
    return user
