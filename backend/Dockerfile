FROM python:3.10-slim

# Install system dependencies including Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    gcc \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your Python app code into the image  
COPY app/ ./app/

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI (adjust if your entry point isn't main.py)
ENV PYTHONPATH=/app/app
CMD ["uvicorn", "app.main:app", "--host=0.0.0.0", "--port=8000"]
