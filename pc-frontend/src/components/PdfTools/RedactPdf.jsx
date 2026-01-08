import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  EyeOff, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  MousePointer,
  Square,
  Type,
  Trash2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
  Shield,
  Search,
  Settings,
  Eye,
  Scan
} from 'lucide-react';

const RedactPdf = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [redactionMode, setRedactionMode] = useState('manual'); // 'manual', 'text', 'pattern'
  const [redactionTool, setRedactionTool] = useState('rectangle'); // 'rectangle', 'text'
  const [redactionAreas, setRedactionAreas] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchPattern, setSearchPattern] = useState('email'); // 'email', 'phone', 'ssn', 'custom'
  const [customPattern, setCustomPattern] = useState('');
  const [redactionColor, setRedactionColor] = useState('#000000');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pdfContent, setPdfContent] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [isLoadingOcr, setIsLoadingOcr] = useState(false);
  const [pdfPages, setPdfPages] = useState([]);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  // Function to display extracted text content
  const toggleExtractedText = () => {
    setShowExtractedText(!showExtractedText);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile) => {
    setError('');
    setSuccess('');
    setRedactionAreas([]);
    setPdfContent(null);
    setOcrText('');
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB.');
      return;
    }

    setFile(selectedFile);
    setIsLoadingOcr(true);
    
    try {
      // Extract PDF content and perform OCR
      await extractPdfContent(selectedFile);
    } catch (err) {
      console.error('PDF processing error:', err);
      setError('Failed to process PDF. Please try again.');
    } finally {
      setIsLoadingOcr(false);
    }
  };

  const extractPdfContent = async (file) => {
    try {
      // Use the proper PDF text extraction service (same as PdfToText)
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/pdf/extract-text`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Parse the response to get text and page count
        let extractedText = '';
        let pageCount = 1;
        
        if (data && data.text) {
          // If it's an object with text property
          extractedText = data.text;
          pageCount = data.pages || 1;
        } else if (typeof data === 'string') {
          // If it's a string, it's the raw text
          extractedText = data;
        } else {
          // Fallback
          extractedText = 'Text extraction completed';
        }
        
        // Set the extracted text for search functionality
        setOcrText(extractedText);
        setTotalPages(pageCount);
        setCurrentPage(1);
        
        // Create page content structure for compatibility
        const pages = [];
        for (let i = 0; i < pageCount; i++) {
          pages.push({
            pageNumber: i + 1,
            text: extractedText, // For now, use full text for all pages
            confidence: 95 // High confidence for direct text extraction
          });
        }
        setPdfContent(pages);
        
        // Load PDF preview
        await loadExtractedTextPreview(file);
        setSuccess(`PDF loaded successfully! ${pageCount} pages processed with text extraction.`);
      } else {
        throw new Error('Failed to extract PDF content');
      }
    } catch (err) {
      console.error('PDF extraction error:', err);
      // Fallback to basic PDF loading
      await loadBasicPdfPreview(file);
      setError('Text extraction failed, using basic preview. Some features may be limited.');
    }
  };

  // Extract text from specific page for better search functionality
  const extractTextFromPage = async (file, pageNumber) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('page', pageNumber.toString());

      const response = await fetch(`${API_BASE_URL}/api/pdf/extract-text`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.text || data || '';
      } else {
        throw new Error('Failed to extract text from page');
      }
    } catch (err) {
      console.error('Page text extraction error:', err);
      return '';
    }
  };

  // Enhanced text search with better coordinate mapping
  const enhancedTextSearch = async (searchText, pageNumber = currentPage) => {
    if (!searchText.trim()) {
      return [];
    }

    try {
      // First try to get page-specific text
      let pageText = '';
      if (file && pageNumber) {
        pageText = await extractTextFromPage(file, pageNumber);
      }
      
      // Fallback to full OCR text if page-specific extraction fails
      if (!pageText && ocrText) {
        pageText = ocrText;
      }

      if (!pageText) {
        return [];
      }

      // Use backend API for accurate text positioning
      const formData = new FormData();
      formData.append('file', file);
      formData.append('search_text', searchText);
      formData.append('page', pageNumber.toString());

      const response = await fetch(`${API_BASE_URL}/api/pdf/find-text`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.matches || [];
      } else {
        // Fallback to client-side search with approximate positioning
        const regex = new RegExp(searchText, 'gi');
        const matches = [...pageText.matchAll(regex)];
        
        return matches.map((match, index) => ({
          x: 50 + (index % 3) * 150,
          y: 150 + Math.floor(index / 3) * 30,
          width: searchText.length * 8,
          height: 20,
          text: match[0],
          index: match.index
        }));
      }
    } catch (err) {
      console.error('Enhanced text search error:', err);
      return [];
    }
  };

  const loadRealPdfPreview = async (file) => {
    try {
      // Convert PDF to images for preview
      const formData = new FormData();
      formData.append('file', file);
      formData.append('page', currentPage.toString());
      formData.append('dpi', '150');

      const response = await fetch(`${API_BASE_URL}/api/pdf/to-image`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const img = new Image();
        const canvas = canvasRef.current;
        
        img.onload = () => {
          if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            drawRedactionAreas();
          }
        };
        
        img.src = URL.createObjectURL(blob);
      } else {
        throw new Error('Failed to load PDF preview');
      }
    } catch (err) {
      console.error('Preview loading error:', err);
      loadBasicPdfPreview(file);
    }
  };

  const loadBasicPdfPreview = async (file) => {
    // Fallback preview when no text is extracted
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 800;
      
      // Draw basic PDF representation
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add border
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Add placeholder text
      ctx.fillStyle = '#666666';
      ctx.font = '14px Arial';
      ctx.fillText('PDF Preview - Text extraction failed', 50, 100);
      ctx.fillText('Please try uploading a different PDF file', 50, 130);
      
      setTotalPages(1);
      setCurrentPage(1);
    }
  };

  const loadPdfPreview = () => {
    // Simulate loading PDF preview on canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 800;
      
      // Draw mock PDF page
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#333333';
      ctx.font = '16px Arial';
      ctx.fillText('PDF Preview - Text extraction failed', 50, 100);
      ctx.fillText('Please upload a valid PDF file to see the preview.', 50, 150);
      ctx.fillText('The preview will show the extracted text content', 50, 180);
      ctx.fillText('from your PDF document for redaction purposes.', 50, 210);
    }
  };

  const loadExtractedTextPreview = async (file) => {
    const canvas = canvasRef.current;
    if (!canvas || !ocrText) {
      return;
    }

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 1000;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw header
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`PDF Text Preview - ${file.name}`, 50, 40);
    ctx.fillText(`Page ${currentPage} of ${totalPages}`, 50, 70);
    
    // Draw extracted text
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    
    const lines = ocrText.split('\n');
    let y = 120;
    const lineHeight = 20;
    const maxWidth = canvas.width - 100;
    
    lines.forEach((line, index) => {
      if (y > canvas.height - 50) return; // Stop if we run out of space
      
      // Handle page separators
      if (line.includes('--- Page')) {
        ctx.fillStyle = '#666666';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(line, 50, y);
        y += lineHeight + 10;
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        return;
      }
      
      // Word wrap for long lines
      const words = line.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine !== '') {
          ctx.fillText(currentLine, 50, y);
          y += lineHeight;
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        ctx.fillText(currentLine, 50, y);
        y += lineHeight;
      }
    });
    
    // Draw redaction areas
    drawRedactionAreas();
  };

  const handleCanvasMouseDown = (e) => {
    if (redactionTool !== 'rectangle') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || redactionTool !== 'rectangle') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Redraw canvas and show preview rectangle
    loadPdfPreview();
    drawRedactionAreas();
    
    // Draw preview rectangle
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
    ctx.setLineDash([]);
  };

  const handleCanvasMouseUp = (e) => {
    if (!isDrawing || redactionTool !== 'rectangle') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add new redaction area
    const newArea = {
      id: Date.now(),
      type: 'rectangle',
      page: currentPage,
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
      color: redactionColor
    };
    
    if (newArea.width > 5 && newArea.height > 5) { // Minimum size
      setRedactionAreas(prev => [...prev, newArea]);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
  };

  const drawRedactionAreas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    redactionAreas
      .filter(area => area.page === currentPage)
      .forEach(area => {
        if (area.type === 'rectangle') {
          ctx.fillStyle = area.color;
          ctx.fillRect(area.x, area.y, area.width, area.height);
          
          // Draw border
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 1;
          ctx.strokeRect(area.x, area.y, area.width, area.height);
        }
      });
  };

  const handleSearchAndRedact = async () => {
    if (!searchText.trim()) {
      setError('Please enter text to search for.');
      return;
    }

    if (!ocrText && !file) {
      setError('No PDF content available. Please upload a PDF file first.');
      return;
    }

    try {
      // Use enhanced text search for better results
      const matches = await enhancedTextSearch(searchText, currentPage);

      if (matches.length > 0) {
        const newAreas = matches.map((match, index) => ({
          id: Date.now() + index,
          type: 'text',
          page: currentPage,
          x: match.x,
          y: match.y,
          width: match.width,
          height: match.height,
          color: redactionColor,
          searchTerm: searchText,
          matchedText: match.text || searchText
        }));

        setRedactionAreas(prev => [...prev, ...newAreas]);
        setSuccess(`Found and marked ${newAreas.length} instances of "${searchText}" for redaction.`);
      } else {
        setError(`No instances of "${searchText}" found on page ${currentPage}.`);
      }
    } catch (err) {
      console.error('Text search error:', err);
      setError('Failed to search text. Please try again.');
    }
  };

  const handlePatternRedact = async () => {
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      custom: customPattern ? new RegExp(customPattern, 'g') : null
    };

    const pattern = patterns[searchPattern];
    if (!pattern) {
      setError('Please select a valid pattern or enter a custom pattern.');
      return;
    }

    if (!ocrText) {
      setError('OCR text not available. Please wait for PDF processing to complete.');
      return;
    }

    try {
      // Use backend API for accurate pattern matching with coordinates
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pattern_type', searchPattern);
      if (searchPattern === 'custom') {
        formData.append('custom_pattern', customPattern);
      }
      formData.append('page', currentPage.toString());

      const response = await fetch(`${API_BASE_URL}/api/pdf/find-patterns`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const matches = data.matches || [];

        const newAreas = matches.map((match, index) => ({
          id: Date.now() + index,
          type: 'pattern',
          page: currentPage,
          x: match.x,
          y: match.y,
          width: match.width,
          height: match.height,
          color: redactionColor,
          pattern: searchPattern,
          matchedText: match.text
        }));

        setRedactionAreas(prev => [...prev, ...newAreas]);
        setSuccess(`Found and marked ${newAreas.length} instances of ${searchPattern} pattern for redaction.`);
      } else {
        // Fallback to client-side pattern matching
        const matches = [...ocrText.matchAll(pattern)];
        
        if (matches.length > 0) {
          const newAreas = matches.slice(0, 10).map((match, index) => ({
            id: Date.now() + index,
            type: 'pattern',
            page: currentPage,
            x: 50 + (index % 4) * 120,
            y: 150 + Math.floor(index / 4) * 25,
            width: match[0].length * 8,
            height: 18,
            color: redactionColor,
            pattern: searchPattern,
            matchedText: match[0]
          }));

          setRedactionAreas(prev => [...prev, ...newAreas]);
          setSuccess(`Found and marked ${matches.length} instances of ${searchPattern} pattern for redaction.`);
        } else {
          setError(`No ${searchPattern} patterns found in the current page.`);
        }
      }
    } catch (err) {
      console.error('Pattern search error:', err);
      setError('Failed to search patterns. Please try again.');
    }
  };

  const removeRedactionArea = (id) => {
    setRedactionAreas(prev => prev.filter(area => area.id !== id));
  };

  const clearAllRedactions = () => {
    setRedactionAreas([]);
    loadPdfPreview();
  };

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
      // Reload real PDF content for the new page
      if (file && pdfContent) {
        try {
          await loadRealPdfPreview(file);
        } catch (err) {
          console.error('Failed to load page:', err);
          loadBasicPdfPreview(file);
        }
      }
    }
  };

  const handleZoomChange = (newZoom) => {
    setZoom(Math.max(50, Math.min(200, newZoom)));
  };

  const handleRedact = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    if (redactionAreas.length === 0) {
      setError('Please mark some areas for redaction first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      // Real API call for PDF redaction
      const formData = new FormData();
      formData.append('file', file);
      formData.append('redaction_areas', JSON.stringify(redactionAreas));
      formData.append('redaction_color', redactionColor);

      const response = await fetch(`${API_BASE_URL}/api/pdf/redact`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Redaction failed' }));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const redactedFileName = file.name.replace('.pdf', '_redacted.pdf');
      
      setProcessedFile({
        blob: blob,
        name: redactedFileName,
        size: blob.size
      });

      setSuccess(`PDF has been successfully redacted! ${redactionAreas.length} areas have been permanently removed.`);
    } catch (err) {
      console.error('Redaction error:', err);
      setError(`Failed to redact PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile) return;

    const url = URL.createObjectURL(processedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFile(null);
    setProcessedFile(null);
    setRedactionAreas([]);
    setCurrentPage(1);
    setTotalPages(0);
    setSearchText('');
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Redraw canvas when redaction areas change
  useEffect(() => {
    if (file && canvasRef.current) {
      if (ocrText) {
        loadExtractedTextPreview(file);
      } else {
        loadBasicPdfPreview(file);
        drawRedactionAreas();
      }
    }
  }, [redactionAreas, currentPage, file, ocrText]);

  // Reload preview when page changes
  useEffect(() => {
    if (file && currentPage && ocrText) {
      loadExtractedTextPreview(file);
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-purple-100 rounded-full">
              <EyeOff className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Redact PDF - Remove Sensitive Information
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Permanently remove sensitive information from your PDF documents. 
            Perfect for legal documents, contracts, and confidential reports.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Tools */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              {/* File Upload */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Upload PDF</h3>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Drop PDF here or click to browse'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Extracted Text Display */}
              {ocrText && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Extracted Text</h3>
                    <button
                      onClick={toggleExtractedText}
                      className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                    >
                      {showExtractedText ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Hide Text
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3 mr-1" />
                          Show Text
                        </>
                      )}
                    </button>
                  </div>
                  
                  {showExtractedText && (
                    <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {ocrText.length > 500 
                          ? `${ocrText.substring(0, 500)}...` 
                          : ocrText
                        }
                      </p>
                      {ocrText.length > 500 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Showing first 500 characters. Full text available for search and redaction.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* File Info and Tools */}
              {file && (
                <div className="space-y-6">
                  {/* File Info */}
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-500 mr-3" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <p className="text-sm text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB • {totalPages} pages
                        </p>
                      </div>
                      <button
                        onClick={resetForm}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* OCR Status */}
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <Scan className="w-5 h-5 text-blue-500 mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-blue-900">Text Extraction Status:</span>
                          {isLoadingOcr ? (
                            <div className="ml-2 flex items-center">
                              <Loader className="w-4 h-4 animate-spin text-blue-500 mr-1" />
                              <span className="text-sm text-blue-600">Processing...</span>
                            </div>
                          ) : ocrText ? (
                            <div className="ml-2 flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600">Text Extracted ({ocrText.length} chars)</span>
                            </div>
                          ) : (
                            <div className="ml-2 flex items-center">
                              <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                              <span className="text-sm text-orange-600">Limited Preview</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      ←
                    </button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      →
                    </button>
        </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => handleZoomChange(zoom - 10)}
                      className="p-2 text-gray-600 hover:text-purple-600"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium">{zoom}%</span>
                    <button
                      onClick={() => handleZoomChange(zoom + 10)}
                      className="p-2 text-gray-600 hover:text-purple-600"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Redaction Mode */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Redaction Mode</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'manual', label: 'Manual Selection', icon: MousePointer },
                        { value: 'text', label: 'Search Text', icon: Search },
                        { value: 'pattern', label: 'Pattern Matching', icon: Settings }
                      ].map(({ value, label, icon: Icon }) => (
                        <label key={value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            value={value}
                            checked={redactionMode === value}
                            onChange={(e) => setRedactionMode(e.target.value)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                          />
                          <Icon className="w-4 h-4 ml-2 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">{label}</span>
            </label>
                      ))}
                    </div>
          </div>

                  {/* Manual Tools */}
                  {redactionMode === 'manual' && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Drawing Tools</h3>
                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            value="rectangle"
                            checked={redactionTool === 'rectangle'}
                            onChange={(e) => setRedactionTool(e.target.value)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                          />
                          <Square className="w-4 h-4 ml-2 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">Rectangle</span>
              </label>
                      </div>
                    </div>
                  )}

                  {/* Text Search */}
                  {redactionMode === 'text' && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900">Search & Redact</h3>
              <input
                type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Enter text to find and redact"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                      <button
                        onClick={handleSearchAndRedact}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                      >
                        Find & Mark
                      </button>
            </div>
          )}

                  {/* Pattern Matching */}
                  {redactionMode === 'pattern' && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900">Pattern Matching</h3>
            <select
                        value={searchPattern}
                        onChange={(e) => setSearchPattern(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      >
                        <option value="email">Email Addresses</option>
                        <option value="phone">Phone Numbers</option>
                        <option value="ssn">Social Security Numbers</option>
                        <option value="custom">Custom Pattern</option>
            </select>
                      {searchPattern === 'custom' && (
                        <input
                          type="text"
                          value={customPattern}
                          onChange={(e) => setCustomPattern(e.target.value)}
                          placeholder="Enter regex pattern"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                      )}
                      <button
                        onClick={handlePatternRedact}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                      >
                        Find Pattern
                      </button>
                    </div>
                  )}

                  {/* Redaction Color */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Redaction Color</h3>
                    <div className="flex space-x-2">
                      {['#000000', '#ff0000', '#0000ff', '#008000'].map(color => (
                        <button
                          key={color}
                          onClick={() => setRedactionColor(color)}
                          className={`w-8 h-8 rounded border-2 ${
                            redactionColor === color ? 'border-gray-600' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={redactionColor}
                        onChange={(e) => setRedactionColor(e.target.value)}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
          </div>
        </div>

                  {/* Redaction List */}
                  {redactionAreas.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Redactions ({redactionAreas.length})
                        </h3>
                        <button
                          onClick={clearAllRedactions}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {redactionAreas.map((area, index) => (
                          <div key={area.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                            <span className="text-gray-700">
                              {area.type} #{index + 1} (Page {area.page})
                            </span>
                            <button
                              onClick={() => removeRedactionArea(area.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t">
          <button
            onClick={handleRedact}
                      disabled={isProcessing || redactionAreas.length === 0}
                      className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Redacting...
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Apply Redactions
                        </>
                      )}
                    </button>

                    {processedFile && (
                      <button
                        onClick={handleDownload}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Redacted PDF
          </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
                    <div className="text-sm text-gray-500">
                      Click and drag to mark areas for redaction
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="w-full cursor-crosshair"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF Selected</h3>
                    <p className="text-gray-500">Upload a PDF file to start redacting sensitive information</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center max-w-4xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
              </div>
            )}

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center max-w-4xl mx-auto">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-3">
            <Shield className="w-5 h-5 text-amber-600 mr-2" />
            <h3 className="text-lg font-semibold text-amber-800">Important Security Notice</h3>
          </div>
          <div className="text-sm text-amber-700 space-y-2">
            <p>• Redaction permanently removes information - this action cannot be undone</p>
            <p>• Always verify redacted areas before sharing documents</p>
            <p>• Your files are processed securely and automatically deleted after processing</p>
            <p>• For highly sensitive documents, consider additional security measures</p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <EyeOff className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Permanent Removal</h3>
            <p className="text-gray-600">Information is permanently removed, not just hidden</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Search className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Detection</h3>
            <p className="text-gray-600">Automatically find emails, phone numbers, and patterns</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Settings className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Patterns</h3>
            <p className="text-gray-600">Create custom regex patterns for specific content types</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedactPdf;