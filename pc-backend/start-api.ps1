<# # PixelCraft Pro API Startup Script (PowerShell)

Write-Host "🚀 Starting PixelCraft Pro API..." -ForegroundColor Cyan

# Create necessary directories
New-Item -ItemType Directory -Force -Path uploads, temp, logs

# Check if virtual environment exists
if (-not (Test-Path venv)) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\Activate

# Install/update dependencies
Write-Host "📚 Installing dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Check if Tesseract is installed
try {
     = Get-Command tesseract -ErrorAction Stop
} catch {
    Write-Host "⚠️  Warning: Tesseract OCR not found. OCR features may not work." -ForegroundColor Yellow
    Write-Host "   Download from: https://github.com/UB-Mannheim/tesseract/wiki" -ForegroundColor Yellow
}

# Set environment variables if .env file exists
if (Test-Path .env)) {
    Write-Host "🔐 Loading environment variables..." -ForegroundColor Cyan
    Get-Content .env | ForEach-Object {
        if ( -match '^([^=]+)=(.*)') {
            [Environment]::SetEnvironmentVariable([1], [2])
        }
    }
}

# Start the server
Write-Host "🌟 Starting FastAPI server..." -ForegroundColor Green
Write-Host "📡 API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📖 API documentation at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🔍 Alternative docs at: http://localhost:8000/redoc" -ForegroundColor Cyan

# Check for dev mode
if ($args[0] -eq "dev") {
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
} else {
    gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
}
 #>


 #!/bin/bash

# PixelCraft Pro API Startup Script

echo "🚀 Starting PixelCraft Pro API..."

# Create necessary directories
mkdir -p uploads
mkdir -p temp
mkdir -p logs

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if Tesseract is installed
if ! command -v tesseract &> /dev/null; then
    echo "⚠️  Warning: Tesseract OCR not found. OCR features may not work."
    echo "   Install with: sudo apt-get install tesseract-ocr (Ubuntu/Debian)"
    echo "   Or: brew install tesseract (macOS)"
fi

# Set environment variables if .env file exists
if [ -f ".env" ]; then
    echo "🔐 Loading environment variables..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the server
echo "🌟 Starting FastAPI server..."
echo "📡 API will be available at: http://localhost:8000"
echo "📖 API documentation at: http://localhost:8000/docs"
echo "🔍 Alternative docs at: http://localhost:8000/redoc"

# Development server
if [ "$1" = "dev" ]; then
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Production server
else
    gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
fi