import pytesseract
from PIL import Image
import io
import numpy as np
import re
import os
from dotenv import load_dotenv

load_dotenv()

TESSERACT_PATH = os.getenv("TESSERACT_PATH")
print(TESSERACT_PATH)

if TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

#pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    custom_config = r'--oem 3 --psm 6'
    text1 = pytesseract.image_to_string(image).lower()
    text2 = pytesseract.image_to_string(image, config=custom_config).lower()
    return [text1, text2]

def parse_fields(text1, text2):
    fields = {}
    patterns = {
        "amount": r"(?i)(?:total\s*(?:amount|price)?|net\s*(?:payable|price|amount))[^0-9]{0,10}(\d+(?:\.\d{2})?)",
        "date": r"(?i)date[^0-9]{0,10}([\d]{2}/[\d]{2}/[\d]{2,4})",
        "time": r"(?i)time[^0-9]{0,10}([0-9]{1,2}:[0-9]{2}(?:\s*[ap]m)?)",
        "address": r"(?i)address[^a-zA-Z0-9]{0,10}(.+)"
    }

    for field, pattern in patterns.items():
        match = re.search(pattern, text1)
        if match:
            fields[field] = match.group(1).strip()
    
    for field, pattern in patterns.items():
        match = re.search(pattern, text2)
        if match:
            fields[field] = match.group(1).strip()

    return fields

