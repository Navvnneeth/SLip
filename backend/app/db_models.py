from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Receipts(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(String)
    date = Column(String)
    time = Column(String)
    address = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))