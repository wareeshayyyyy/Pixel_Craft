# PDF Tools Backend Endpoints Required

This document lists all the backend API endpoints that need to be implemented to support the PDF tools frontend without "failed to fetch" errors.

## ✅ Core PDF Processing Endpoints

### 1. **PDF Manipulation**
- `POST /api/pdf/merge` - Merge multiple PDFs
- `POST /api/pdf/split` - Split PDF into multiple files
- `POST /api/pdf/compress` - Compress PDF file size
- `POST /api/pdf/protect` - Add password protection
- `POST /api/pdf/unlock` - Remove password protection
- `POST /api/pdf/repair` - Fix corrupted PDFs
- `POST /api/pdf/rotate` - Rotate PDF pages
- `POST /api/pdf/crop` - Crop PDF pages

### 2. **PDF Conversion (FROM PDF)**
- `POST /api/pdf/to-word` - Convert PDF to Word (DOC/DOCX)
- `POST /api/pdf/to-excel` - Convert PDF to Excel
- `POST /api/pdf/to-ppt` - Convert PDF to PowerPoint
- `POST /api/pdf/to-images` - Convert PDF to images (JPG/PNG/TIFF)
- `POST /api/pdf/to-html` - Convert PDF to HTML
- `POST /api/pdf/to-text` - Extract text from PDF
- `POST /api/pdf/to-pdfa` - Convert to PDF/A format

### 3. **PDF Conversion (TO PDF)**
- `POST /api/convert/word-to-pdf` - Convert Word to PDF
- `POST /api/convert/excel-to-pdf` - Convert Excel to PDF
- `POST /api/convert/ppt-to-pdf` - Convert PowerPoint to PDF
- `POST /api/convert/jpg-to-pdf` - Convert images to PDF
- `POST /api/convert/html-to-pdf` - Convert HTML to PDF
- `POST /api/convert/scan-to-pdf` - Convert scanned images to PDF

### 4. **PDF Enhancement**
- `POST /api/pdf/watermark` - Add watermarks
- `POST /api/pdf/sign` - Add digital signatures
- `POST /api/pdf/add-page-numbers` - Add page numbering
- `POST /api/pdf/extract-pages` - Extract specific pages
- `POST /api/pdf/remove-pages` - Remove specific pages
- `POST /api/pdf/organize` - Reorganize page order
- `POST /api/pdf/ocr` - OCR processing for scanned PDFs
- `POST /api/pdf/redact` - Redact sensitive information
- `POST /api/pdf/compare` - Compare two PDF files

## 📋 Endpoint Specifications

### Request Format
All endpoints should accept:
```
Content-Type: multipart/form-data
```

**Standard Fields:**
- `file` (required) - The PDF file to process
- `settings` (optional) - JSON string with operation-specific settings

### Response Format
All endpoints should return:
```
Content-Type: application/pdf (for PDF outputs)
Content-Type: application/octet-stream (for other formats)
```

### Error Handling
All endpoints should return consistent error responses:
```json
{
  "error": true,
  "message": "Human-readable error message",
  "detail": "Technical error details",
  "status": 400
}
```

## 🔧 Implementation Priority

### **HIGH PRIORITY** (Core functionality)
1. `/api/pdf/merge` - Most used feature
2. `/api/pdf/split` - Essential splitting
3. `/api/pdf/compress` - File size management
4. `/api/pdf/to-word` - Popular conversion
5. `/api/pdf/to-images` - Common need

### **MEDIUM PRIORITY** (Security & Enhancement)
1. `/api/pdf/protect` - Security features
2. `/api/pdf/unlock` - Security features
3. `/api/pdf/watermark` - Branding needs
4. `/api/pdf/rotate` - Basic manipulation
5. `/api/pdf/extract-pages` - Page management

### **LOW PRIORITY** (Advanced features)
1. `/api/pdf/ocr` - Advanced processing
2. `/api/pdf/sign` - Digital signatures
3. `/api/pdf/compare` - Comparison tools
4. `/api/pdf/redact` - Privacy features
5. All other conversion endpoints

## 📦 Required Libraries/Dependencies

### Python Backend (FastAPI/Flask)
```bash
# PDF Processing
PyPDF2==3.0.1
pypdf==3.0.1
reportlab==4.0.4
fitz==0.0.1.dev2  # PyMuPDF
pdf2image==1.16.3

# Document Conversion
python-docx==0.8.11
openpyxl==3.1.2
python-pptx==0.6.21
Pillow==10.0.0

# OCR
pytesseract==0.3.10
opencv-python==4.8.0.74

# Utilities
requests==2.31.0
aiofiles==23.1.0
```

### Node.js Backend (Express)
```json
{
  "pdf-lib": "^1.17.1",
  "pdf2pic": "^2.1.4",
  "hummus-recipe": "^1.6.0",
  "officegen": "^0.6.5",
  "mammoth": "^1.5.1",
  "sharp": "^0.32.1",
  "multer": "^1.4.5-lts.1"
}
```

## 🚀 Deployment Considerations

### File Size Limits
- Individual file: 100MB max
- Total request: 500MB max
- Timeout: 300 seconds for processing

### Storage
- Temporary file cleanup after processing
- No permanent storage of user files
- Memory-efficient streaming for large files

### Performance
- Async processing for large operations
- Progress tracking for long-running tasks
- Rate limiting to prevent abuse

## 🔒 Security Requirements

### Input Validation
- File type verification (MIME type + magic bytes)
- File size limits
- Malware scanning (optional but recommended)

### Output Sanitization
- Remove metadata from processed files
- Ensure no script injection in HTML outputs
- Validate all user inputs

### Privacy
- No logging of file contents
- Automatic cleanup of temporary files
- HTTPS-only communication

## 📝 Testing Endpoints

### Health Check
- `GET /api/health` - Service health status
- `GET /api/pdf/status` - PDF processing service status

### Sample Test Files
Create test endpoints that accept sample files:
- `GET /api/test/sample.pdf` - Download sample PDF
- `POST /api/test/validate` - Validate endpoint functionality

## 🎯 Success Criteria

✅ **No more "failed to fetch" errors**
✅ **All PDF tools have working download functionality**  
✅ **Consistent error handling across all tools**
✅ **Progress indication for long operations**
✅ **File metadata preservation where appropriate**
✅ **Secure file handling and cleanup**

---

**Next Steps:**
1. Implement high-priority endpoints first
2. Test each endpoint with the updated frontend components
3. Add comprehensive error handling
4. Implement file cleanup and security measures
5. Add progress tracking for long operations
