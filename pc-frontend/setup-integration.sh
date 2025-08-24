#!/bin/bash

# PixelCraft Pro - Automated Setup Script
# This script sets up the complete frontend-backend integration

set -e  # Exit on any error

echo "🚀 PixelCraft Pro - Full Stack Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from correct directory
if [ ! -f "package.json" ] && [ ! -d "src" ]; then
    print_error "Please run this script from your React frontend directory"
    exit 1
fi

# Step 1: Setup Project Structure
print_status "Setting up project structure..."

# Create backend directory if it doesn't exist
if [ ! -d "../backend" ]; then
    mkdir -p ../backend
    print_success "Created backend directory"
else
    print_warning "Backend directory already exists"
fi

# Create frontend service directories
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/utils

print_success "Project structure created"

# Step 2: Install Frontend Dependencies
print_status "Installing frontend dependencies..."

# Check if package.json exists
if [ -f "package.json" ]; then
    npm install axios
    print_success "Frontend dependencies installed"
else
    print_error "package.json not found. Are you in the React project directory?"
    exit 1
fi

# Step 3: Create Frontend Environment File
print_status "Creating frontend environment configuration..."

cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAX_FILE_SIZE=50000000
REACT_APP_SUPPORTED_IMAGE_FORMATS=jpg,jpeg,png,webp,gif,bmp
REACT_APP_SUPPORTED_PDF_FORMATS=pdf
REACT_APP_ENVIRONMENT=development
EOF

print_success "Frontend .env file created"

# Step 4: Create API Service Files
print_status "Creating API service layer..."

# Create base API service
cat > src/services/api.js << 'EOF'
// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.makeRequest(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  async uploadMultipleFiles(endpoint, files, additionalData = {}) {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.makeRequest(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  async downloadFile(response, filename) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export default new ApiService();
EOF

# Create PDF service
cat > src/services/pdfService.js << 'EOF'
import ApiService from './api';

class PDFService {
  async convertToWord(file) {
    const response = await ApiService.uploadFile('/pdf/to-word', file);
    const filename = `${file.name.split('.')[0]}.docx`;
    await ApiService.downloadFile(response, filename);
  }

  async convertToImages(file, format = 'png', dpi = 150) {
    const response = await ApiService.makeRequest(
      `/pdf/to-images?format=${format}&dpi=${dpi}`,
      {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        })(),
      }
    );
    
    const filename = `${file.name.split('.')[0]}_images.zip`;
    await ApiService.downloadFile(response, filename);
  }

  async extractText(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await ApiService.makeRequest('/pdf/extract-text', {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  }

  async mergePDFs(files) {
    const response = await ApiService.uploadMultipleFiles('/pdf/merge', files);
    await ApiService.downloadFile(response, 'merged.pdf');
  }

  async splitPDF(file, pagesPerFile = 1) {
    const response = await ApiService.uploadFile('/pdf/split', file, {
      pages_per_file: pagesPerFile
    });
    
    const filename = `${file.name.split('.')[0]}_split.zip`;
    await ApiService.downloadFile(response, filename);
  }

  async compressPDF(file, quality = 50) {
    const response = await ApiService.uploadFile('/pdf/compress', file, {
      quality
    });
    
    const filename = `compressed_${file.name}`;
    await ApiService.downloadFile(response, filename);
  }
}

export default new PDFService();
EOF

# Create Image service
cat > src/services/imageService.js << 'EOF'
import ApiService from './api';

class ImageService {
  async convertFormat(file, format, quality = 95) {
    const response = await ApiService.makeRequest(
      `/image/convert?format=${format}&quality=${quality}`,
      {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        })(),
      }
    );
    
    const filename = `${file.name.split('.')[0]}.${format}`;
    await ApiService.downloadFile(response, filename);
  }

  async resizeImage(file, width, height, maintainAspect = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('maintain_aspect', maintainAspect);

    const response = await ApiService.makeRequest('/image/resize', {
      method: 'POST',
      body: formData,
    });
    
    const filename = `resized_${file.name}`;
    await ApiService.downloadFile(response, filename);
  }

  async removeBackground(file) {
    const response = await ApiService.uploadFile('/image/remove-background', file);
    const filename = `no_bg_${file.name.split('.')[0]}.png`;
    await ApiService.downloadFile(response, filename);
  }

  async compressImage(file, quality = 85) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);

    const response = await ApiService.makeRequest('/image/compress', {
      method: 'POST',
      body: formData,
    });
    
    const filename = `compressed_${file.name.split('.')[0]}.jpg`;
    await ApiService.downloadFile(response, filename);
  }
}

export default new ImageService();
EOF

# Create custom hook
cat > src/hooks/useFileProcessor.js << 'EOF'
import { useState } from 'react';
import PDFService from '../services/pdfService';
import ImageService from '../services/imageService';

export const useFileProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const processFile = async (operation, file, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      let result;
      
      // PDF Operations
      if (operation === 'pdf-to-word') {
        result = await PDFService.convertToWord(file);
      } else if (operation === 'pdf-to-images') {
        result = await PDFService.convertToImages(file, options.format, options.dpi);
      } else if (operation === 'pdf-extract-text') {
        result = await PDFService.extractText(file);
      } else if (operation === 'pdf-merge') {
        result = await PDFService.mergePDFs(file);
      } else if (operation === 'pdf-split') {
        result = await PDFService.splitPDF(file, options.pagesPerFile);
      } else if (operation === 'pdf-compress') {
        result = await PDFService.compressPDF(file, options.quality);
      }
      
      // Image Operations
      else if (operation === 'image-convert') {
        result = await ImageService.convertFormat(file, options.format, options.quality);
      } else if (operation === 'image-resize') {
        result = await ImageService.resizeImage(file, options.width, options.height, options.maintainAspect);
      } else if (operation === 'image-remove-bg') {
        result = await ImageService.removeBackground(file);
      } else if (operation === 'image-compress') {
        result = await ImageService.compressImage(file, options.quality);
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    processFile,
    loading,
    error,
    progress,
    clearError: () => setError(null)
  };
};
EOF

print_success "API service layer created"

# Step 5: Create utility functions
print_status "Creating utility functions..."

cat > src/utils/fileUtils.js << 'EOF'
// File validation utilities
export const validateFile = (file, type = 'any') => {
  const maxSize = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 50000000; // 50MB default
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${Math.round(maxSize / 1000000)}MB limit`);
  }

  const imageFormats = (process.env.REACT_APP_SUPPORTED_IMAGE_FORMATS || 'jpg,jpeg,png,webp,gif,bmp').split(',');
  const pdfFormats = (process.env.REACT_APP_SUPPORTED_PDF_FORMATS || 'pdf').split(',');

  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (type === 'image' && !imageFormats.includes(fileExtension)) {
    throw new Error(`Unsupported image format. Supported: ${imageFormats.join(', ')}`);
  }

  if (type === 'pdf' && !pdfFormats.includes(fileExtension)) {
    throw new Error(`Unsupported PDF format. Supported: ${pdfFormats.join(', ')}`);
  }

  return true;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
  const pdfFormats = ['pdf'];
  
  if (imageFormats.includes(extension)) return 'image';
  if (pdfFormats.includes(extension)) return 'pdf';
  return 'other';
};
EOF

print_success "Utility functions created"

# Step 6: Create example React component
print_status "Creating example component..."

mkdir -p src/components/examples

cat > src/components/examples/FileProcessor.js << 'EOF'
import React, { useState } from 'react';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import { validateFile, formatFileSize, getFileType } from '../../utils/fileUtils';

const FileProcessor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [operation, setOperation] = useState('pdf-to-word');
  const [options, setOptions] = useState({});
  const { processFile, loading, error, progress, clearError } = useFileProcessor();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileType = getFileType(file.name);
      validateFile(file, fileType);
      setSelectedFile(file);
      clearError();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    try {
      await processFile(operation, selectedFile, options);
    } catch (err) {
      console.error('Processing failed:', err);
    }
  };

  const renderOptions = () => {
    if (operation === 'image-resize') {
      return (
        <div className="options">
          <input
            type="number"
            placeholder="Width"
            onChange={(e) => setOptions({...options, width: parseInt(e.target.value)})}
          />
          <input
            type="number"
            placeholder="Height"
            onChange={(e) => setOptions({...options, height: parseInt(e.target.value)})}
          />
          <label>
            <input
              type="checkbox"
              onChange={(e) => setOptions({...options, maintainAspect: e.target.checked})}
            />
            Maintain Aspect Ratio
          </label>
        </div>
      );
    }

    if (operation === 'image-convert') {
      return (
        <div className="options">
          <select onChange={(e) => setOptions({...options, format: e.target.value})}>
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WebP</option>
            <option value="gif">GIF</option>
          </select>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="file-processor" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>PixelCraft File Processor</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.bmp"
        />
        {selectedFile && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={operation} 
          onChange={(e) => setOperation(e.target.value)}
          disabled={loading}
        >
          <optgroup label="PDF Operations">
            <option value="pdf-to-word">PDF to Word</option>
            <option value="pdf-to-images">PDF to Images</option>
            <option value="pdf-extract-text">Extract Text</option>
            <option value="pdf-compress">Compress PDF</option>
            <option value="pdf-split">Split PDF</option>
          </optgroup>
          <optgroup label="Image Operations">
            <option value="image-convert">Convert Format</option>
            <option value="image-resize">Resize Image</option>
            <option value="image-remove-bg">Remove Background</option>
            <option value="image-compress">Compress Image</option>
          </optgroup>
        </select>
      </div>

      {renderOptions()}
      
      <button 
        onClick={handleProcess} 
        disabled={!selectedFile || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Processing...' : 'Process File'}
      </button>
      
      {loading && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '5px' }}>Progress: {progress}%</div>
          <div style={{ 
            width: '100%', 
            height: '10px', 
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileProcessor;
EOF

print_success "Example component created"

# Step 7: Backend setup check
print_status "Checking backend setup..."

if [ ! -f "../backend/main.py" ]; then
    print_warning "Backend files not found. Creating backend setup..."
    
    # Create backend directory structure
    mkdir -p ../backend
    
    print_status "Please copy the backend files (main.py, requirements.txt, etc.) to ../backend/"
    print_status "Then run: cd ../backend && ./start.sh dev"
else
    print_success "Backend files found"
fi

# Step 8: Create development start script
print_status "Creating development start script..."

cat > start-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting PixelCraft Pro Development Environment"

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Check if backend is running
if check_port 8000; then
    echo "✅ Backend is already running on port 8000"
else
    echo "🔧 Starting backend..."
    cd ../backend
    if [ -f "start.sh" ]; then
        ./start.sh dev &
        echo "🔧 Backend starting in background..."
        cd ../frontend
    else
        echo "❌ Backend start.sh not found. Please set up backend first."
        exit 1
    fi
fi

# Start frontend
echo "🎨 Starting frontend..."
npm start
EOF

chmod +x start-dev.sh

print_success "Development start script created"

# Step 9: Create production Docker setup
print_status "Creating production Docker configuration..."

cat > ../docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ALLOWED_ORIGINS=http://localhost:3000
      - DEBUG=False
    volumes:
      - ./backend/temp:/app/temp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      backend:
        condition: service_healthy

networks:
  default:
    driver: bridge
EOF

# Create frontend Dockerfile
cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx configuration
cat > nginx.conf << 'EOF'
server {
    listen 3000;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Handle file uploads
    client_max_body_size 50M;
}
EOF

print_success "Docker configuration created"

# Step 10: Create README for integration
print_status "Creating integration README..."

cat > INTEGRATION_README.md << 'EOF'
# PixelCraft Pro - Integration Guide

## Quick Start

### Development Mode
```bash
# Start both frontend and backend
./start-dev.sh
```

### Manual Start
```bash
# Terminal 1 - Backend
cd ../backend
./start.sh dev

# Terminal 2 - Frontend  
npm start
```

## Available Services

### PDF Operations
- `PDFService.convertToWord(file)`
- `PDFService.convertToImages(file, format, dpi)`
- `PDFService.extractText(file)`
- `PDFService.mergePDFs(files)`
- `PDFService.splitPDF(file, pagesPerFile)`
- `PDFService.compressPDF(file, quality)`

### Image Operations
- `ImageService.convertFormat(file, format, quality)`
- `ImageService.resizeImage(file, width, height, maintainAspect)`
- `ImageService.removeBackground(file)`
- `ImageService.compressImage(file, quality)`

### Custom Hook
```javascript
import { useFileProcessor } from './hooks/useFileProcessor';

const { processFile, loading, error, progress } = useFileProcessor();

// Usage
await processFile('pdf-to-word', file);
await processFile('image-resize', file, { width: 800, height: 600 });
```

## Example Component

Check `src/components/examples/FileProcessor.js` for a complete integration example.

## API Endpoints

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## Production Deployment

```bash
# Build and deploy with Docker
docker-compose up --build
```

## Environment Variables

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_MAX_FILE_SIZE`: Maximum file size in bytes

### Backend (../backend/.env)
- `ALLOWED_ORIGINS`: Allowed CORS origins
- `MAX_FILE_SIZE`: Maximum file size in MB
EOF

print_success "Integration README created"

# Final steps and summary
echo ""
echo "🎉 PixelCraft Pro Setup Complete!"
echo "================================="
echo ""
print_success "✅ Project structure created"
print_success "✅ Frontend dependencies installed"
print_success "✅ API service layer implemented"
print_success "✅ Custom hooks and utilities added"
print_success "✅ Example components created"
print_success "✅ Docker configuration ready"
print_success "✅ Development scripts created"
echo ""
echo "📋 Next Steps:"
echo "1. Set up the backend:"
echo "   cd ../backend"
echo "   # Copy backend files (main.py, requirements.txt, etc.)"
echo "   ./start.sh dev"
echo ""
echo "2. Start development:"
echo "   ./start-dev.sh"
echo ""
echo "3. Open your browser:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/docs"
echo ""
echo "📖 Check INTEGRATION_README.md for detailed usage instructions"
echo ""
print_success "Happy coding! 🚀"#!/bin/bash
# [paste the ENTIRE script content here]













































#!/bin/bash

# PixelCraft Pro - Fixed Integration Setup Script
# This script fixes common integration issues

set -e

echo "🔧 PixelCraft Pro - Integration Fix Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from React frontend directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from your React frontend directory"
    exit 1
fi

print_status "Starting integration fixes..."

# Fix 1: Update Backend CORS and PDF Processing
print_status "Fixing backend CORS and PDF processing..."

cat > ../backend/main_fixed.py << 'EOF'
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
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
import logging

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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PixelCraft Pro API", version="1.0.0")

# CORS middleware - FIXED
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Added both variants
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
async def root():
    return {"message": "PixelCraft Pro API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

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
    except Exception as e:
        logger.warning(f"Failed to cleanup file {file_path}: {e}")

# FIXED PDF Text Extraction
@app.post("/pdf/extract-text")
async def extract_text_from_pdf(file: UploadFile = File(...)):
    """Extract text from PDF using OCR if necessary - FIXED"""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    temp_pdf = create_temp_file(".pdf")
    
    try:
        # Save uploaded file
        with open(temp_pdf, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        logger.info(f"Processing PDF: {file.filename}, size: {len(content)} bytes")
        
        # Extract text using PyMuPDF with proper error handling
        extracted_text = ""
        page_count = 0
        
        # Try to open PDF with PyMuPDF
        try:
            pdf_document = fitz.open(temp_pdf)
            page_count = len(pdf_document)
            
            for page_num in range(page_count):
                try:
                    page = pdf_document.load_page(page_num)
                    text = page.get_text()
                    
                    # If no text found, use OCR
                    if not text.strip():
                        logger.info(f"No text found on page {page_num + 1}, using OCR...")
                        try:
                            # Get page as image for OCR
                            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better OCR
                            pix = page.get_pixmap(matrix=mat)
                            img_data = pix.tobytes("png")
                            img = Image.open(BytesIO(img_data))
                            
                            # Use Tesseract OCR
                            text = pytesseract.image_to_string(img, lang='eng')
                            logger.info(f"OCR extracted {len(text)} characters from page {page_num + 1}")
                        except Exception as ocr_error:
                            logger.error(f"OCR failed for page {page_num + 1}: {ocr_error}")
                            text = f"[OCR Error on page {page_num + 1}]"
                    
                    extracted_text += f"--- Page {page_num + 1} ---\n{text}\n\n"
                    
                except Exception as page_error:
                    logger.error(f"Error processing page {page_num + 1}: {page_error}")
                    extracted_text += f"--- Page {page_num + 1} ---\n[Error processing page]\n\n"
            
            pdf_document.close()
            
        except Exception as pdf_error:
            logger.error(f"Failed to open PDF with PyMuPDF: {pdf_error}")
            # Fallback to PyPDF2
            try:
                with open(temp_pdf, 'rb') as pdf_file:
                    pdf_reader = PyPDF2.PdfReader(pdf_file)
                    page_count = len(pdf_reader.pages)
                    
                    for page_num, page in enumerate(pdf_reader.pages):
                        try:
                            text = page.extract_text()
                            extracted_text += f"--- Page {page_num + 1} ---\n{text}\n\n"
                        except Exception as page_error:
                            logger.error(f"Error extracting text from page {page_num + 1}: {page_error}")
                            extracted_text += f"--- Page {page_num + 1} ---\n[Error extracting text]\n\n"
                            
            except Exception as fallback_error:
                logger.error(f"Fallback PDF processing failed: {fallback_error}")
                raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(fallback_error)}")
        
        cleanup_file(temp_pdf)
        
        if not extracted_text.strip():
            extracted_text = "[No text found in PDF]"
        
        return JSONResponse({
            "text": extracted_text,
            "pages": page_count,
            "filename": file.filename,
            "status": "success"
        })
    
    except HTTPException:
        cleanup_file(temp_pdf)
        raise
    except Exception as e:
        cleanup_file(temp_pdf)
        logger.error(f"Text extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

# Add other endpoints here (pdf/to-word, image processing, etc.)
# [Include all your other working endpoints from main.py]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
EOF

print_success "Backend fixes applied"

# Fix 2: Create proper Docker configuration
print_status "Creating fixed Docker configuration..."

cat > ../docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
      - DEBUG=True
      - PYTHONUNBUFFERED=1
    volumes:
      - ./backend/temp:/app/temp
      - ./backend:/app
    networks:
      - pixelcraft-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
      - CHOKIDAR_USEPOLLING=true
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - pixelcraft-network
    depends_on:
      backend:
        condition: service_healthy

networks:
  pixelcraft-network:
    driver: bridge
EOF

# Fix 3: Create fixed backend Dockerfile
cat > ../backend/Dockerfile << 'EOF'
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (for better Docker caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create temp directory
RUN mkdir -p /app/temp

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
EOF

# Fix 4: Update frontend Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
EOF

# Fix 5: Create corrected API service
print_status "Creating fixed API service..."

cat > src/services/api.js << 'EOF'
// Fixed API service with proper error handling and CORS
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Please ensure the backend is running on http://localhost:8000');
      }
      
      throw error;
    }
  }

  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.makeRequest(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  async downloadFile(response, filename) {
    try {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download file');
    }
  }

  // Health check method
  async checkHealth() {
    try {
      const response = await this.makeRequest('/health');
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default new ApiService();
EOF

# Fix 6: Create connection test component
print_status "Creating connection test component..."

cat > src/components/ConnectionTest.js << 'EOF'
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const ConnectionTest = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setBackendStatus('checking');
    setError(null);
    
    try {
      const isHealthy = await ApiService.checkHealth();
      setBackendStatus(isHealthy ?