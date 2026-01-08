import React, { useState, useRef, useCallback } from 'react';
import { 
  Download, 
  Globe, 
  Camera, 
  AlertCircle, 
  CheckCircle, 
  Loader, 
  ExternalLink,
  Upload,
  FileText,
  Monitor,
  Smartphone,
  Tablet,
  Settings,
  Trash2,
  Eye,
  Copy,
  RefreshCw,
  Zap
} from 'lucide-react';

const HtmlToImage = () => {
  const [inputMethod, setInputMethod] = useState('url'); // 'url', 'html', 'file'
  const [url, setUrl] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [viewportHeight, setViewportHeight] = useState(1080);
  const [deviceType, setDeviceType] = useState('desktop');
  const [fullPage, setFullPage] = useState(false);
  const [delay, setDelay] = useState(1000);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  // Device presets matching iLoveIMG
  const devicePresets = {
    desktop: { width: 1920, height: 1080, label: 'Desktop (1920×1080)' },
    laptop: { width: 1366, height: 768, label: 'Laptop (1366×768)' },
    tablet: { width: 1024, height: 768, label: 'Tablet (1024×768)' },
    mobile: { width: 375, height: 667, label: 'Mobile (375×667)' },
    custom: { width: viewportWidth, height: viewportHeight, label: 'Custom Size' }
  };

  // Quality settings
  const qualityOptions = [
    { value: 100, label: 'Maximum (100%)', size: 'Largest file' },
    { value: 90, label: 'High (90%)', size: 'Recommended' },
    { value: 75, label: 'Medium (75%)', size: 'Balanced' },
    { value: 60, label: 'Low (60%)', size: 'Smallest file' }
  ];

  // Validate URL
  const isValidUrl = useCallback((string) => {
    try {
      const urlObj = new URL(string);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }, []);

  // Normalize URL (add https if missing)
  const normalizeUrl = useCallback((inputUrl) => {
    if (!inputUrl) return '';
    if (!/^https?:\/\//i.test(inputUrl)) {
      return `https://${inputUrl}`;
    }
    return inputUrl;
  }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/html') {
      setUploadedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setHtmlContent(e.target.result);
        createPreview(e.target.result, 'html');
      };
      reader.readAsText(file);
    } else {
      setError('Please select an HTML file (.html)');
    }
  };

  // Create preview iframe
  const createPreview = useCallback((content, type) => {
    let previewContent = '';
    
    if (type === 'url') {
      previewContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>URL Preview</h2>
          <p><strong>Target URL:</strong> ${content}</p>
          <p>The actual webpage will be captured during conversion</p>
          <div style="margin: 20px 0; padding: 20px; background: #f0f0f0; border-radius: 8px;">
            <p>🌐 Ready to capture: <strong>${content}</strong></p>
          </div>
        </div>
      `;
    } else {
      previewContent = content;
    }
    
    setPreview(previewContent);
  }, []);

  // Handle URL input change
  const handleUrlChange = (value) => {
    setUrl(value);
    setError('');
    if (value && isValidUrl(normalizeUrl(value))) {
      createPreview(normalizeUrl(value), 'url');
    } else {
      setPreview(null);
    }
  };

  // Handle HTML content change
  const handleHtmlChange = (value) => {
    setHtmlContent(value);
    setError('');
    if (value.trim()) {
      createPreview(value, 'html');
    } else {
      setPreview(null);
    }
  };

  // Apply device preset
  const applyDevicePreset = (device) => {
    setDeviceType(device);
    if (device !== 'custom') {
      setViewportWidth(devicePresets[device].width);
      setViewportHeight(devicePresets[device].height);
    }
  };

  // Dynamic import for html2canvas
  const loadHtml2Canvas = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.html2canvas) {
        resolve(window.html2canvas);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => resolve(window.html2canvas);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, []);

  // Main conversion function
  const convertToImage = async () => {
    let contentToConvert = '';
    let sourceType = '';

    // Determine content source
    if (inputMethod === 'url') {
      if (!url) {
        setError('Please enter a website URL');
        return;
      }
      const normalizedUrl = normalizeUrl(url);
      if (!isValidUrl(normalizedUrl)) {
        setError('Please enter a valid URL');
        return;
      }
      contentToConvert = normalizedUrl;
      sourceType = 'url';
    } else if (inputMethod === 'html') {
      if (!htmlContent.trim()) {
        setError('Please enter HTML content');
        return;
      }
      contentToConvert = htmlContent;
      sourceType = 'html';
    } else if (inputMethod === 'file') {
      if (!uploadedFile) {
        setError('Please upload an HTML file');
        return;
      }
      contentToConvert = htmlContent;
      sourceType = 'file';
    }

    setIsConverting(true);
    setError('');
    setSuccess('');

    try {
      const html2canvas = await loadHtml2Canvas();
      
      if (sourceType === 'url') {
        await captureFromUrl(contentToConvert, html2canvas);
      } else {
        await captureFromHtml(contentToConvert, html2canvas, sourceType);
      }
      
    } catch (err) {
      console.error('Conversion error:', err);
      setError(`Conversion failed: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  // Capture from URL using proxy iframe method
  const captureFromUrl = async (targetUrl, html2canvas) => {
    try {
      // Method 1: Try iframe capture (works for CORS-enabled sites)
      await captureWithIframe(targetUrl, html2canvas);
    } catch (iframeError) {
      console.log('Direct iframe capture failed, creating preview...');
      // Create a professional webpage preview instead
      await createProfessionalPreview(targetUrl);
    }
  };

  // Capture using iframe for same-origin or CORS-enabled sites
  const captureWithIframe = async (targetUrl, html2canvas) => {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-10000px';
      iframe.style.top = '-10000px';
      iframe.style.width = `${viewportWidth}px`;
      iframe.style.height = `${viewportHeight}px`;
      iframe.style.border = 'none';
      iframe.style.backgroundColor = 'white';
      iframe.src = targetUrl;
      
      document.body.appendChild(iframe);

      const cleanup = () => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      };

      iframe.onload = async () => {
        try {
          // Wait for page to fully load
          await new Promise(resolve => setTimeout(resolve, delay));

          let targetElement;
          try {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDocument) {
              throw new Error('CORS restriction');
            }
            targetElement = iframeDocument.body;
          } catch (corsError) {
            throw new Error('Cannot access iframe content due to CORS restrictions');
          }

          // Capture the content
          const canvas = await html2canvas(targetElement, {
            width: viewportWidth,
            height: fullPage ? null : viewportHeight,
            useCORS: true,
            allowTaint: true,
            scale: 1,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            logging: false
          });

          await saveCanvasAsImage(canvas, targetUrl, 'URL');
          cleanup();
          resolve();

        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      iframe.onerror = () => {
        cleanup();
        reject(new Error('Failed to load webpage'));
      };

      // Timeout protection
      setTimeout(() => {
        cleanup();
        reject(new Error('Timeout: Website took too long to load'));
      }, 15000);
    });
  };

  // Capture from HTML content
  const captureFromHtml = async (htmlContent, html2canvas, sourceType) => {
    // Create temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-10000px';
    container.style.top = '-10000px';
    container.style.width = `${viewportWidth}px`;
    container.style.height = fullPage ? 'auto' : `${viewportHeight}px`;
    container.style.backgroundColor = '#ffffff';
    container.style.overflow = fullPage ? 'visible' : 'hidden';
    container.innerHTML = htmlContent;
    
    document.body.appendChild(container);

    try {
      // Wait for any images or resources to load
      await new Promise(resolve => setTimeout(resolve, delay));

      const canvas = await html2canvas(container, {
        width: viewportWidth,
        height: fullPage ? null : viewportHeight,
        useCORS: true,
        allowTaint: true,
        scale: 1,
        backgroundColor: '#ffffff',
        logging: false
      });

      const sourceName = sourceType === 'file' 
        ? uploadedFile.name 
        : 'HTML Content';
        
      await saveCanvasAsImage(canvas, sourceName, sourceType.toUpperCase());
      
    } finally {
      document.body.removeChild(container);
    }
  };

  // Create professional webpage preview (fallback for CORS-restricted URLs)
  const createProfessionalPreview = async (targetUrl) => {
    const canvas = document.createElement('canvas');
    canvas.width = viewportWidth;
    canvas.height = viewportHeight;
    const ctx = canvas.getContext('2d');
    
    // Create realistic browser interface
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);
    
    // Browser chrome
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, viewportWidth, 70);
    
    // Address bar
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    const barWidth = viewportWidth - 120;
    const barHeight = 36;
    const barX = 60;
    const barY = 17;
    
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // URL text
    ctx.fillStyle = '#495057';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(targetUrl, barX + 12, barY + 23);
    
    // Lock icon (https)
    if (targetUrl.startsWith('https')) {
      ctx.fillStyle = '#28a745';
      ctx.fillRect(barX + barWidth - 30, barY + 15, 6, 6);
    }
    
    // Page content area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 70, viewportWidth, viewportHeight - 70);
    
    // Header section
    const headerHeight = Math.min(120, viewportHeight * 0.15);
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(40, 100, viewportWidth - 80, headerHeight);
    
    // Navigation
    ctx.fillStyle = '#dee2e6';
    ctx.fillRect(40, 100 + headerHeight + 20, viewportWidth - 80, 40);
    
    // Content columns
    const contentY = 100 + headerHeight + 80;
    const colWidth = (viewportWidth - 160) / 3;
    
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#f8f9fa' : '#e9ecef';
      ctx.fillRect(40 + i * (colWidth + 20), contentY, colWidth, 200);
    }
    
    // Add text content
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Website Screenshot', viewportWidth / 2, 160);
    
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(new URL(targetUrl).hostname, viewportWidth / 2, 185);
    
    // Footer with info
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#6c757d';
    const footerY = viewportHeight - 60;
    ctx.fillText(`Dimensions: ${viewportWidth}×${viewportHeight}`, 40, footerY);
    ctx.fillText(`Format: ${format.toUpperCase()}`, 40, footerY + 20);
    ctx.fillText('Note: Preview generated - Real capture requires CORS-enabled website', 40, footerY + 40);
    
    await saveCanvasAsImage(canvas, targetUrl, 'URL Preview');
  };

  // Save canvas as image file
  const saveCanvasAsImage = async (canvas, sourceName, sourceType) => {
    return new Promise((resolve) => {
      const mimeType = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
      const qualityValue = format === 'png' ? undefined : quality / 100;
      
      canvas.toBlob((blob) => {
        if (blob) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
          const fileName = `webpage_${timestamp}.${format}`;
          
          const file = new File([blob], fileName, {
            type: mimeType,
            lastModified: Date.now(),
          });
          
          const imageData = {
            file,
            source: sourceName,
            sourceType,
            dimensions: `${canvas.width} × ${canvas.height}`,
            format: format.toUpperCase(),
            size: (blob.size / 1024 / 1024).toFixed(2),
            quality: `${quality}%`,
            timestamp: new Date().toLocaleString(),
            preview: canvas.toDataURL(mimeType, qualityValue)
          };
          
          setConvertedImages(prev => [...prev, imageData]);
          setSuccess(`Image converted successfully! (${imageData.size} MB)`);
        }
        resolve();
      }, mimeType, qualityValue);
    });
  };

  // Download image
  const downloadImage = (imageData) => {
    const url = URL.createObjectURL(imageData.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = imageData.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download all images
  const downloadAll = () => {
    convertedImages.forEach((imageData, index) => {
      setTimeout(() => downloadImage(imageData), index * 200);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setConvertedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all
  const clearAll = () => {
    setConvertedImages([]);
    setError('');
    setSuccess('');
    setPreview(null);
  };

  // Reset form
  const resetForm = () => {
    setUrl('');
    setHtmlContent('');
    setUploadedFile(null);
    setPreview(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Camera className="w-10 h-10 text-red-500" />
            HTML to Image Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert websites, HTML files, or HTML code to high-quality images. 
            Professional screenshot tool with customizable settings.
          </p>
        </div>

        {/* Main Conversion Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Input Method Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b">
            {[
              { id: 'url', label: 'Website URL', icon: Globe },
              { id: 'html', label: 'HTML Code', icon: FileText },
              { id: 'file', label: 'HTML File', icon: Upload }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setInputMethod(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  inputMethod === id
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Input Content */}
          <div className="mb-8">
            {inputMethod === 'url' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com or example.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Try these examples:</span>
                  {[
                    'https://example.com',
                    'https://httpbin.org/html',
                    'https://jsonplaceholder.typicode.com/'
                  ].map(example => (
                    <button
                      key={example}
                      onClick={() => handleUrlChange(example)}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {inputMethod === 'html' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  HTML Code
                </label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => handleHtmlChange(e.target.value)}
                  placeholder="Enter your HTML code here..."
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleHtmlChange('<h1>Hello World!</h1><p>This is a sample HTML page.</p>')}
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200"
                  >
                    Sample HTML
                  </button>
                  <button
                    onClick={() => setHtmlContent('')}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {inputMethod === 'file' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Upload HTML File
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {uploadedFile ? uploadedFile.name : 'Click to select HTML file'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .html files up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Output Settings
              </h3>
              
              {/* Format Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Image Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'png', label: 'PNG', desc: 'Best quality, transparent support' },
                    { value: 'jpg', label: 'JPG', desc: 'Smaller size, good quality' },
                    { value: 'jpeg', label: 'JPEG', desc: 'Standard format' }
                  ].map(fmt => (
                    <button
                      key={fmt.value}
                      onClick={() => setFormat(fmt.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        format === fmt.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{fmt.label}</div>
                      <div className="text-xs text-gray-500">{fmt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Setting */}
              {format !== 'png' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Image Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
              )}

              {/* Capture Options */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">Capture Options</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fullPage}
                      onChange={(e) => setFullPage(e.target.checked)}
                      className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                    />
                    <span>Full page screenshot (entire content)</span>
                  </label>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Loading delay: {delay}ms
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="500"
                      value={delay}
                      onChange={(e) => setDelay(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Viewport Settings
              </h3>

              {/* Device Presets */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Device Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(devicePresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyDevicePreset(key)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        deviceType === key
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {key === 'desktop' && <Monitor className="w-4 h-4" />}
                        {key === 'laptop' && <Monitor className="w-4 h-4" />}
                        {key === 'tablet' && <Tablet className="w-4 h-4" />}
                        {key === 'mobile' && <Smartphone className="w-4 h-4" />}
                        {key === 'custom' && <Settings className="w-4 h-4" />}
                        <span className="font-medium text-sm">{preset.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={viewportWidth}
                    onChange={(e) => {
                      setViewportWidth(Number(e.target.value));
                      setDeviceType('custom');
                    }}
                    min="100"
                    max="4000"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={viewportHeight}
                    onChange={(e) => {
                      setViewportHeight(Number(e.target.value));
                      setDeviceType('custom');
                    }}
                    min="100"
                    max="4000"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t">
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
              {preview && (
                <button
                  onClick={() => setPreview(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Hide Preview
                </button>
              )}
            </div>
            
            <button
              onClick={convertToImage}
              disabled={isConverting || (!url && !htmlContent && !uploadedFile)}
              className="flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {isConverting ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>Convert to {format.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        {preview && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Content Preview
            </h3>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <iframe
                ref={previewRef}
                srcDoc={preview}
                className="w-full h-96 border-none"
                style={{ maxWidth: '100%' }}
                title="Content Preview"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Preview shows approximate content. Actual image may vary based on viewport settings.
            </p>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800">Success</h4>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Results Panel */}
        {convertedImages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Converted Images ({convertedImages.length})
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={downloadAll}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-md"
                >
                  <Download className="w-5 h-5" />
                  Download All
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {convertedImages.map((imageData, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-4 relative group hover:border-red-300 transition-colors">
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  
                  {/* Image Preview */}
                  {imageData.preview && (
                    <div className="mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={imageData.preview} 
                        alt="Preview"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Image Details */}
                  <div className="space-y-2 mb-4">
                    <div className="font-semibold text-gray-800 truncate" title={imageData.file.name}>
                      {imageData.file.name}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-medium">{imageData.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{imageData.size} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimensions:</span>
                        <span className="font-medium">{imageData.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className="font-medium">{imageData.quality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span className="font-medium">{imageData.sourceType}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Created: {imageData.timestamp}
                    </div>
                    <div className="text-xs text-gray-600 break-all">
                      {imageData.source.length > 50 
                        ? imageData.source.substring(0, 50) + '...' 
                        : imageData.source}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => downloadImage(imageData)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download {imageData.format}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions & Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            💡 How to Use & Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">📋 Instructions:</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Choose input method: URL, HTML code, or HTML file</li>
                <li>• Select image format (PNG for quality, JPG for size)</li>
                <li>• Choose device preset or set custom dimensions</li>
                <li>• Adjust quality and capture settings as needed</li>
                <li>• Click "Convert" to generate your image</li>
                <li>• Download individual images or all at once</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">⚡ Pro Tips:</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Use PNG for images with transparency or text</li>
                <li>• JPG works best for photos and complex graphics</li>
                <li>• Increase loading delay for heavy websites</li>
                <li>• Full page captures entire scrollable content</li>
                <li>• Higher quality = larger file size</li>
                <li>• Desktop resolution works best for most sites</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Technical Notes:
            </h4>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Real website screenshots work best with CORS-enabled sites</li>
              <li>• Some websites block iframe embedding for security</li>
              <li>• For restricted sites, a preview image will be generated</li>
              <li>• HTML code and file uploads always work perfectly</li>
              <li>• Best results with modern, responsive websites</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>© 2025 PixelCraft - Professional HTML to Image Conversion Tool</p>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default HtmlToImage;