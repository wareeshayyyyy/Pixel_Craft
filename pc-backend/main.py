from fastapi import FastAPI, File, UploadFile, HTTPException, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Union
import os
import io
import tempfile
import shutil
from pathlib import Path
import uuid
import asyncio
from datetime import datetime

# PDF processing
import PyPDF2
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import fitz  # PyMuPDF
from pdf2docx import Converter
import openpyxl
from pptx import Presentation

# Image processing
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import cv2
import numpy as np
from rembg import remove

# OCR
import pytesseract

# Utilities
import zipfile
import json
from io import BytesIO
import base64

app = FastAPI(title="PixelCraft Pro API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class ConversionRequest(BaseModel):
    format: str
    quality: Optional[int] = 95

class ImageEditRequest(BaseModel):
    brightness: Optional[float] = None
    contrast: Optional[float] = None
    saturation: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None

class PDFEditRequest(BaseModel):
    password: Optional[str] = None
    watermark_text: Optional[str] = None
    rotation: Optional[int] = None

# Utility functions
def create_temp_file(suffix: str = "") -> str:
    """Create a temporary file and return its path"""
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    temp_file.close()
    return temp_file.name

def cleanup_file(file_path: str):
    """Clean up temporary files"""
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
    except Exception:
        pass

# Health check
@app.get("/")
async def root():
    return {"message": "PixelCraft Pro API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# PDF Conversion Endpoints

@app.post("/pdf/to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    """Convert PDF to Word document"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save uploaded file
    temp_pdf = create_temp_file(".pdf")
    temp_docx = create_temp_file(".docx")
    
    try:
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert PDF to DOCX
        cv = Converter(temp_pdf)
        cv.convert(temp_docx)
        cv.close()
        
        return FileResponse(
            temp_docx,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{file.filename.rsplit('.', 1)[0]}.docx"
        )
    
    except Exception as e:
        cleanup_file(temp_pdf)
        cleanup_file(temp_docx)
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@app.post("/pdf/to-images")
async def pdf_to_images(file: UploadFile = File(...), format: str = "png", dpi: int = 150):
    """Convert PDF pages to images"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_pdf = create_temp_file(".pdf")
    
    try:
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Convert PDF to images
        pdf_document = fitz.open(temp_pdf)
        images = []
        
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            mat = fitz.Matrix(dpi/72, dpi/72)
            pix = page.get_pixmap(matrix=mat)
            img_data = pix.tobytes(format.upper())
            images.append(img_data)
        
        pdf_document.close()
        
        # Create zip file with images
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for i, img_data in enumerate(images):
                zip_file.writestr(f"page_{i+1}.{format}", img_data)
        
        zip_buffer.seek(0)
        cleanup_file(temp_pdf)
        
        return StreamingResponse(
            io.BytesIO(zip_buffer.read()),
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={file.filename.rsplit('.', 1)[0]}_images.zip"}
        )
    
    except Exception as e:
        cleanup_file(temp_pdf)
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@app.post("/pdf/extract-text")
async def extract_text_from_pdf(file: UploadFile = File(...)):
    """Extract text from PDF using OCR if necessary"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_pdf = create_temp_file(".pdf")
    
    try:
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract text
        pdf_document = fitz.open(temp_pdf)
        extracted_text = ""
        
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text = page.get_text()
            
            # If no text found, use OCR
            if not text.strip():
                pix = page.get_pixmap()
                img_data = pix.tobytes("png")
                img = Image.open(BytesIO(img_data))
                text = pytesseract.image_to_string(img)
            
            extracted_text += f"--- Page {page_num + 1} ---\n{text}\n\n"
        
        pdf_document.close()
        cleanup_file(temp_pdf)
        
        return {"text": extracted_text, "pages": len(pdf_document)}
    
    except Exception as e:
        cleanup_file(temp_pdf)
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

# PDF Editing Endpoints

@app.post("/pdf/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """Merge multiple PDF files"""
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required")
    
    temp_files = []
    temp_output = create_temp_file(".pdf")
    
    try:
        # Save all uploaded files
        for file in files:
            if not file.filename.endswith('.pdf'):
                raise HTTPException(status_code=400, detail="Only PDF files are allowed")
            
            temp_file = create_temp_file(".pdf")
            with open(temp_file, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            temp_files.append(temp_file)
        
        # Merge PDFs
        merger = PyPDF2.PdfMerger()
        for temp_file in temp_files:
            merger.append(temp_file)
        
        with open(temp_output, "wb") as output_file:
            merger.write(output_file)
        merger.close()
        
        # Cleanup temp files
        for temp_file in temp_files:
            cleanup_file(temp_file)
        
        return FileResponse(
            temp_output,
            media_type="application/pdf",
            filename="merged.pdf"
        )
    
    except Exception as e:
        for temp_file in temp_files:
            cleanup_file(temp_file)
        cleanup_file(temp_output)
        raise HTTPException(status_code=500, detail=f"Merge failed: {str(e)}")

@app.post("/pdf/split")
async def split_pdf(file: UploadFile = File(...), pages_per_file: int = 1):
    """Split PDF into multiple files"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_pdf = create_temp_file(".pdf")
    
    try:
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Split PDF
        pdf_reader = PyPDF2.PdfReader(temp_pdf)
        total_pages = len(pdf_reader.pages)
        
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for i in range(0, total_pages, pages_per_file):
                writer = PyPDF2.PdfWriter()
                
                for j in range(i, min(i + pages_per_file, total_pages)):
                    writer.add_page(pdf_reader.pages[j])
                
                temp_split = create_temp_file(".pdf")
                with open(temp_split, "wb") as split_file:
                    writer.write(split_file)
                
                with open(temp_split, "rb") as split_file:
                    zip_file.writestr(f"part_{i//pages_per_file + 1}.pdf", split_file.read())
                
                cleanup_file(temp_split)
        
        zip_buffer.seek(0)
        cleanup_file(temp_pdf)
        
        return StreamingResponse(
            io.BytesIO(zip_buffer.read()),
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={file.filename.rsplit('.', 1)[0]}_split.zip"}
        )
    
    except Exception as e:
        cleanup_file(temp_pdf)
        raise HTTPException(status_code=500, detail=f"Split failed: {str(e)}")

@app.post("/pdf/compress")
async def compress_pdf(file: UploadFile = File(...), quality: int = 50):
    """Compress PDF file"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_pdf = create_temp_file(".pdf")
    temp_output = create_temp_file(".pdf")
    
    try:
        with open(temp_pdf, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Compress PDF using PyMuPDF
        pdf_document = fitz.open(temp_pdf)
        pdf_document.save(temp_output, garbage=4, deflate=True, clean=True)
        pdf_document.close()
        
        cleanup_file(temp_pdf)
        
        return FileResponse(
            temp_output,
            media_type="application/pdf",
            filename=f"compressed_{file.filename}"
        )
    
    except Exception as e:
        cleanup_file(temp_pdf)
        cleanup_file(temp_output)
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

# Image Processing Endpoints

@app.post("/image/convert")
async def convert_image(file: UploadFile = File(...), format: str = "png", quality: int = 95):
    """Convert image to different format"""
    allowed_formats = ["png", "jpg", "jpeg", "webp", "gif", "bmp"]
    if format.lower() not in allowed_formats:
        raise HTTPException(status_code=400, detail=f"Format must be one of: {allowed_formats}")
    
    try:
        # Open and convert image
        image = Image.open(file.file)
        
        # Convert RGBA to RGB for JPEG
        if format.lower() in ["jpg", "jpeg"] and image.mode == "RGBA":
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background
        
        # Save to BytesIO
        output = BytesIO()
        image.save(output, format=format.upper(), quality=quality)
        output.seek(0)
        
        filename = f"{file.filename.rsplit('.', 1)[0]}.{format}"
        media_type = f"image/{format}"
        
        return StreamingResponse(
            output,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

@app.post("/image/resize")
async def resize_image(
    file: UploadFile = File(...),
    width: int = Form(...),
    height: int = Form(...),
    maintain_aspect: bool = Form(False)
):
    """Resize image"""
    try:
        image = Image.open(file.file)
        
        if maintain_aspect:
            image.thumbnail((width, height), Image.Resampling.LANCZOS)
        else:
            image = image.resize((width, height), Image.Resampling.LANCZOS)
        
        output = BytesIO()
        format = image.format or "PNG"
        image.save(output, format=format)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type=f"image/{format.lower()}",
            headers={"Content-Disposition": f"attachment; filename=resized_{file.filename}"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resize failed: {str(e)}")

@app.post("/image/enhance")
async def enhance_image(
    file: UploadFile = File(...),
    brightness: float = Form(1.0),
    contrast: float = Form(1.0),
    saturation: float = Form(1.0)
):
    """Enhance image brightness, contrast, and saturation"""
    try:
        image = Image.open(file.file)
        
        # Apply enhancements
        if brightness != 1.0:
            enhancer = ImageEnhance.Brightness(image)
            image = enhancer.enhance(brightness)
        
        if contrast != 1.0:
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(contrast)
        
        if saturation != 1.0:
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(saturation)
        
        output = BytesIO()
        format = image.format or "PNG"
        image.save(output, format=format)
        output.seek(0)
        
        return StreamingResponse(
            output,
            media_type=f"image/{format.lower()}",
            headers={"Content-Disposition": f"attachment; filename=enhanced_{file.filename}"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

@app.post("/image/remove-background")
async def remove_background(file: UploadFile = File(...)):
    """Remove background from image using AI"""
    try:
        # Read image
        input_data = await file.read()
        
        # Remove background
        output_data = remove(input_data)
        
        filename = f"no_bg_{file.filename.rsplit('.', 1)[0]}.png"
        
        return StreamingResponse(
            BytesIO(output_data),
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")

@app.post("/image/compress")
async def compress_image(file: UploadFile = File(...), quality: int = Form(85)):
    """Compress image to reduce file size"""
    try:
        image = Image.open(file.file)
        
        # Convert to RGB if necessary
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        
        output = BytesIO()
        image.save(output, format="JPEG", quality=quality, optimize=True)
        output.seek(0)
        
        filename = f"compressed_{file.filename.rsplit('.', 1)[0]}.jpg"
        
        return StreamingResponse(
            output,
            media_type="image/jpeg",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

@app.post("/image/add-watermark")
async def add_watermark(
    file: UploadFile = File(...),
    text: str = Form(...),
    position: str = Form("bottom-right"),
    opacity: float = Form(0.5)
):
    """Add text watermark to image"""
    try:
        image = Image.open(file.file)
        
        # Create watermark
        watermark = Image.new("RGBA", image.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark)
        
        # Calculate font size based on image size
        font_size = max(20, min(image.size) // 20)
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        # Get text dimensions
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Calculate position
        margin = 20
        positions = {
            "top-left": (margin, margin),
            "top-right": (image.width - text_width - margin, margin),
            "bottom-left": (margin, image.height - text_height - margin),
            "bottom-right": (image.width - text_width - margin, image.height - text_height - margin),
            "center": ((image.width - text_width) // 2, (image.height - text_height) // 2)
        }
        
        pos = positions.get(position, positions["bottom-right"])
        
        # Draw text with opacity
        text_color = (255, 255, 255, int(255 * opacity))
        draw.text(pos, text, font=font, fill=text_color)
        
        # Composite watermark onto image
        if image.mode != "RGBA":
            image = image.convert("RGBA")
        
        watermarked = Image.alpha_composite(image, watermark)
        
        output = BytesIO()
        watermarked.save(output, format="PNG")
        output.seek(0)
        
        filename = f"watermarked_{file.filename.rsplit('.', 1)[0]}.png"
        
        return StreamingResponse(
            output,
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Watermark failed: {str(e)}")

# Utility Endpoints

@app.post("/image/to-pdf")
async def images_to_pdf(files: List[UploadFile] = File(...)):
    """Convert multiple images to a single PDF"""
    if not files:
        raise HTTPException(status_code=400, detail="At least one image file is required")
    
    temp_output = create_temp_file(".pdf")
    
    try:
        images = []
        for file in files:
            image = Image.open(file.file)
            if image.mode != "RGB":
                image = image.convert("RGB")
            images.append(image)
        
        # Save as PDF
        if images:
            images[0].save(temp_output, save_all=True, append_images=images[1:])
        
        return FileResponse(
            temp_output,
            media_type="application/pdf",
            filename="images_to_pdf.pdf"
        )
    
    except Exception as e:
        cleanup_file(temp_output)
        raise HTTPException(status_code=500, detail=f"PDF creation failed: {str(e)}")

@app.post("/ocr/extract-text")
async def ocr_extract_text(file: UploadFile = File(...)):
    """Extract text from image using OCR"""
    try:
        image = Image.open(file.file)
        text = pytesseract.image_to_string(image)
        
        return {"text": text, "filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return {"error": "Internal server error", "detail": str(exc)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)