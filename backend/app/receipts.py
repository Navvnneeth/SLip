from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from db_models import Receipts
from starlette import status
from ocr_utils import extract_text, parse_fields
from typing import Annotated
from database import SessionLocal
from auth import verify_token_and_get_current_user
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter(
    prefix='/receipts',
    tags=['receipts']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Receipt(BaseModel):
    amount: str
    date: str
    time: str
    address: str

user_dependency = Annotated[dict, Depends(verify_token_and_get_current_user)]
db_dependency = Annotated[Session, Depends(get_db)]

@router.post('/upload-image', status_code=status.HTTP_200_OK)
async def upload(user: user_dependency, file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text(contents)
    fields = parse_fields(text[0], text[1])
    return fields

@router.post('/upload-receipt-data', status_code=status.HTTP_200_OK)
async def add_receipt_to_db(user: user_dependency, receipt: Receipt, db: db_dependency):
    new_reciept = Receipts(amount = receipt.amount, date = receipt.date, time = receipt.time, address = receipt.address, user_id = user["id"])
    db.add(new_reciept)
    db.commit()
    db.refresh(new_reciept)
    return new_reciept

@router.get('/', status_code=status.HTTP_200_OK)
async def get_all_receipts(user: user_dependency, db: db_dependency):
    receipts = db.query(Receipts).filter(Receipts.user_id == user["id"]).order_by(Receipts.id.asc()).all()
    return receipts

@router.get('/{receipt_id}', status_code=status.HTTP_200_OK)
async def get_specific_receipt(receipt_id: int, user: user_dependency, db: db_dependency):
    receipt = db.query(Receipts).filter(Receipts.id == receipt_id, Receipts.user_id == user["id"]).first()
    if not receipt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receipt not found")
    return receipt

@router.delete('/{receipt_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_receipt(receipt_id: int, user: user_dependency, db: db_dependency):
    receipt = db.query(Receipts).filter(Receipts.id == receipt_id, Receipts.user_id == user["id"]).first()
    if not receipt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receipt not found")
    db.delete(receipt)
    db.commit()

@router.put('/{receipt_id}', status_code=status.HTTP_200_OK)
async def update_receipt(receipt_id: int, db: db_dependency, user: user_dependency, new_receipt: Receipt):
    receipt = db.query(Receipts).filter(Receipts.id == receipt_id, Receipts.user_id == user["id"]).first()
    if not receipt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receipt not found")
    receipt.amount = new_receipt.amount
    receipt.date = new_receipt.date
    receipt.time = new_receipt.time
    receipt.address = new_receipt.address
    db.commit()
    db.refresh(receipt)
    return receipt

