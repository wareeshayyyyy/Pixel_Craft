FROM python:3.11-slim  

WORKDIR /app  
COPY . .  

RUN apt-get update && \  
    apt-get install -y tesseract-ocr && \  
    apt-get clean && \  
    rm -rf /var/lib/apt/lists/*  

RUN pip install --no-cache-dir -r requirements.txt  

RUN mkdir -p /app/uploads /app/temp  

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]  
