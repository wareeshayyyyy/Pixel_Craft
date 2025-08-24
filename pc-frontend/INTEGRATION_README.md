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
