import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Globe, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Eye,
  Code,
  Settings,
  X,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  ExternalLink,
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  Link as LinkIcon,
  Zap
} from 'lucide-react';

const PdfToHtml = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState(null);
  const [conversionOptions, setConversionOptions] = useState({
    preserveLayout: true,
    extractImages: true,
    preserveFonts: true,
    responsiveDesign: false,
    includeCSS: true,
    extractLinks: true,
    optimizeForWeb: true,
    compressionLevel: 'medium'
  });
  const [outputFormat, setOutputFormat] = useState('complete'); // 'complete', 'content-only', 'structured'
  const [cssFramework, setCssFramework] = useState('bootstrap'); // 'bootstrap', 'tailwind', 'custom', 'none'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [htmlPreview, setHtmlPreview] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [conversionStats, setConversionStats] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('preview'); // 'preview', 'html', 'css', 'stats'
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

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
    setProcessedFiles(null);
    setHtmlPreview('');
    setExtractedData(null);
    setConversionStats(null);
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit for PDF to HTML
      setError('File size must be less than 100MB.');
      return;
    }

    setFile(selectedFile);
    
    // Analyze PDF structure first
    await analyzePdfStructure(selectedFile);
  };

  const analyzePdfStructure = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/pdf/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTotalPages(data.page_count || 1);
        setCurrentPage(1);
        setExtractedData({
          pageCount: data.page_count,
          hasImages: data.has_images,
          hasLinks: data.has_links,
          hasForms: data.has_forms,
          fonts: data.fonts || [],
          textContent: data.text_preview || '',
          fileSize: file.size
        });
        setSuccess(`PDF analyzed successfully! ${data.page_count} pages detected with ${data.fonts?.length || 0} fonts.`);
      } else {
        throw new Error('Failed to analyze PDF structure');
      }
    } catch (err) {
      console.error('PDF analysis error:', err);
      // Set basic info as fallback
      setTotalPages(1);
      setCurrentPage(1);
      setExtractedData({
        pageCount: 1,
        hasImages: false,
        hasLinks: false,
        hasForms: false,
        fonts: [],
        textContent: 'Analysis failed - using basic conversion',
        fileSize: file.size
      });
      setError('PDF analysis failed, using basic conversion settings.');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');
    setConversionStats(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(conversionOptions));
      formData.append('output_format', outputFormat);
      formData.append('css_framework', cssFramework);

      const response = await fetch(`${API_BASE_URL}/api/pdf/to-html`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Conversion failed' }));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setProcessedFiles({
        html: data.html_content || '',
        css: data.css_content || '',
        images: data.images || [],
        assets: data.assets || [],
        zipBlob: data.zip_file ? await fetch(data.zip_file).then(r => r.blob()) : null
      });

      setHtmlPreview(data.html_content || '');
      
      setConversionStats({
        processingTime: data.processing_time || 0,
        extractedImages: data.images?.length || 0,
        extractedLinks: data.links?.length || 0,
        preservedFonts: data.fonts?.length || 0,
        totalElements: data.element_count || 0,
        fileSize: data.output_size || 0
      });

      setSuccess(`PDF converted to HTML successfully! ${data.pages_processed || totalPages} pages processed.`);
      setActiveTab('preview');
    } catch (err) {
      console.error('Conversion error:', err);
      setError(`Failed to convert PDF: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (type) => {
    if (!processedFiles) return;

    let content, filename, mimeType;

    switch (type) {
      case 'html':
        content = processedFiles.html;
        filename = file.name.replace('.pdf', '.html');
        mimeType = 'text/html';
        break;
      case 'css':
        content = processedFiles.css;
        filename = file.name.replace('.pdf', '.css');
        mimeType = 'text/css';
        break;
      case 'zip':
        if (processedFiles.zipBlob) {
          const url = URL.createObjectURL(processedFiles.zipBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name.replace('.pdf', '_html_package.zip');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        return;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setSuccess('Code copied to clipboard!');
    } catch (err) {
      setError('Failed to copy to clipboard.');
    }
  };

  const resetForm = () => {
    setFile(null);
    setProcessedFiles(null);
    setHtmlPreview('');
    setExtractedData(null);
    setConversionStats(null);
    setCurrentPage(1);
    setTotalPages(0);
    setError('');
    setSuccess('');
    setActiveTab('preview');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      case 'desktop': return { width: '100%', height: '600px' };
      default: return { width: '100%', height: '600px' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-indigo-100 rounded-full">
              <Globe className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF to HTML Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert your PDF documents to responsive HTML web pages with preserved formatting, 
            images, and interactive elements. Perfect for web publishing and digital content.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Panel - Upload & Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              {/* File Upload */}
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-indigo-400 bg-indigo-50' 
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Upload PDF
                  </h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Choose File
                  </button>
                  <p className="text-xs text-gray-500 mt-3">Max: 100MB</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Info */}
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-500 mr-3" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                        {totalPages > 0 && ` • ${totalPages} pages`}
                      </p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* PDF Analysis Results */}
                  {extractedData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Document Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Pages:</span>
                          <span className="font-medium text-blue-900">{extractedData.pageCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Images:</span>
                          <span className="font-medium text-blue-900">{extractedData.hasImages ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Links:</span>
                          <span className="font-medium text-blue-900">{extractedData.hasLinks ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Forms:</span>
                          <span className="font-medium text-blue-900">{extractedData.hasForms ? '✓' : '✗'}</span>
                        </div>
                        <div className="flex justify-between col-span-2">
                          <span className="text-blue-700">Fonts:</span>
                          <span className="font-medium text-blue-900">{extractedData.fonts?.length || 0} detected</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Output Format */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Layout className="w-4 h-4 mr-2" />
                      Output Format
                    </h3>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="complete">Complete Website</option>
                      <option value="content-only">Content Only</option>
                      <option value="structured">Structured HTML</option>
                    </select>
                  </div>

                  {/* CSS Framework */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      CSS Framework
                    </h3>
                    <select
                      value={cssFramework}
                      onChange={(e) => setCssFramework(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="bootstrap">Bootstrap 5</option>
                      <option value="tailwind">Tailwind CSS</option>
                      <option value="custom">Custom CSS</option>
                      <option value="none">No Framework</option>
                    </select>
                  </div>

                  {/* Conversion Options */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Conversion Options
                    </h3>
                    <div className="space-y-3">
                      {Object.entries({
                        preserveLayout: 'Preserve Original Layout',
                        extractImages: 'Extract & Include Images',
                        preserveFonts: 'Preserve Font Styling',
                        responsiveDesign: 'Make Responsive',
                        includeCSS: 'Generate CSS File',
                        extractLinks: 'Convert PDF Links',
                        optimizeForWeb: 'Optimize for Web',
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-xs text-gray-700">{label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={conversionOptions[key]}
                              onChange={(e) => setConversionOptions({
                                ...conversionOptions, 
                                [key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compression Level */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Optimization Level
                    </h3>
                    <select
                      value={conversionOptions.compressionLevel}
                      onChange={(e) => setConversionOptions({
                        ...conversionOptions, 
                        compressionLevel: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="low">Low (Best Quality)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="high">High (Smallest Size)</option>
                    </select>
                  </div>

                  {/* Convert Button */}
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Convert to HTML
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview & Output */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {file ? (
                <div className="space-y-6">
                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200">
                    {[
                      { id: 'preview', label: 'Live Preview', icon: Eye },
                      { id: 'html', label: 'HTML Code', icon: Code },
                      { id: 'css', label: 'CSS Styles', icon: Palette },
                      { id: 'stats', label: 'Statistics', icon: Settings }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center px-4 py-2 font-medium text-sm transition-colors duration-200 ${
                          activeTab === id
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Preview Mode Controls */}
                  {activeTab === 'preview' && processedFiles && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Preview:</span>
                        {[
                          { id: 'desktop', icon: Monitor, label: 'Desktop' },
                          { id: 'tablet', icon: Tablet, label: 'Tablet' },
                          { id: 'mobile', icon: Smartphone, label: 'Mobile' }
                        ].map(({ id, icon: Icon, label }) => (
                          <button
                            key={id}
                            onClick={() => setPreviewMode(id)}
                            className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                              previewMode === id
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-1" />
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Download Buttons */}
                      {processedFiles && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload('html')}
                            className="flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            HTML
                          </button>
                          <button
                            onClick={() => handleDownload('css')}
                            className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            CSS
                          </button>
                          <button
                            onClick={() => handleDownload('zip')}
                            className="flex items-center px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Package
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content Area */}
                  <div className="min-h-[500px]">
                    {/* Live Preview Tab */}
                    {activeTab === 'preview' && (
                      <div className="space-y-4">
                        {processedFiles ? (
                          <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Live Preview - {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} View
                              </span>
                              <button
                                onClick={() => window.open('data:text/html,' + encodeURIComponent(processedFiles.html), '_blank')}
                                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Open in New Tab
                              </button>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-center">
                              <div 
                                style={getPreviewDimensions()}
                                className="bg-white border border-gray-300 shadow-lg overflow-auto"
                              >
                                <iframe
                                  ref={previewRef}
                                  srcDoc={processedFiles.html}
                                  className="w-full h-full border-none"
                                  title="HTML Preview"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-center">
                              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
                              <p className="text-gray-500">Convert your PDF to see the HTML preview</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* HTML Code Tab */}
                    {activeTab === 'html' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Generated HTML Code</h3>
                          {processedFiles?.html && (
                            <button
                              onClick={() => copyToClipboard(processedFiles.html)}
                              className="flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </button>
                          )}
                        </div>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <div className="bg-gray-800 px-4 py-2 flex items-center">
                            <Code className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-sm font-medium text-green-400">HTML</span>
                          </div>
                          <pre className="p-4 text-sm text-green-300 overflow-auto max-h-96 leading-relaxed">
                            {processedFiles?.html || 'HTML code will appear here after conversion...'}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* CSS Code Tab */}
                    {activeTab === 'css' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Generated CSS Styles</h3>
                          {processedFiles?.css && (
                            <button
                              onClick={() => copyToClipboard(processedFiles.css)}
                              className="flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </button>
                          )}
                        </div>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <div className="bg-gray-800 px-4 py-2 flex items-center">
                            <Palette className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-sm font-medium text-blue-400">CSS</span>
                          </div>
                          <pre className="p-4 text-sm text-blue-300 overflow-auto max-h-96 leading-relaxed">
                            {processedFiles?.css || 'CSS styles will appear here after conversion...'}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Statistics Tab */}
                    {activeTab === 'stats' && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Conversion Statistics</h3>
                        {conversionStats ? (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-900 mb-3">Processing Metrics</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Processing Time:</span>
                                  <span className="font-medium text-blue-900">{conversionStats.processingTime}s</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Total Elements:</span>
                                  <span className="font-medium text-blue-900">{conversionStats.totalElements}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Output Size:</span>
                                  <span className="font-medium text-blue-900">
                                    {(conversionStats.fileSize / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-green-900 mb-3">Extracted Content</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-green-700">Images:</span>
                                  <span className="font-medium text-green-900">{conversionStats.extractedImages}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">Links:</span>
                                  <span className="font-medium text-green-900">{conversionStats.extractedLinks}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700">Fonts:</span>
                                  <span className="font-medium text-green-900">{conversionStats.preservedFonts}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p>Conversion statistics will appear here after processing</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Download Actions */}
                  {processedFiles && (
                    <div className="flex flex-wrap gap-3 pt-6 border-t">
                      <button
                        onClick={() => handleDownload('html')}
                        className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download HTML
                      </button>
                      <button
                        onClick={() => handleDownload('css')}
                        className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download CSS
                      </button>
                      <button
                        onClick={() => handleDownload('zip')}
                        className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Package
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No PDF Selected</h3>
                    <p className="text-gray-500">Upload a PDF file to start conversion to HTML</p>
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

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Layout className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Layout Preservation</h3>
            <p className="text-gray-600 text-sm">Maintains original PDF formatting and structure</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <ImageIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Image Extraction</h3>
            <p className="text-gray-600 text-sm">Automatically extracts and optimizes all images</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Type className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Font Preservation</h3>
            <p className="text-gray-600 text-sm">Preserves fonts and typography styling</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <LinkIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Links</h3>
            <p className="text-gray-600 text-sm">Converts PDF links to clickable HTML links</p>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Technical Specifications</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-indigo-300 mb-4">Supported Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Text extraction with OCR fallback</li>
                <li>• Vector graphics conversion</li>
                <li>• Form elements preservation</li>
                <li>• Table structure maintenance</li>
                <li>• Hyperlink conversion</li>
                <li>• Font embedding options</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-300 mb-4">Output Options</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Responsive HTML5 markup</li>
                <li>• CSS3 styling with frameworks</li>
                <li>• Optimized image formats</li>
                <li>• Clean, semantic code</li>
                <li>• Cross-browser compatibility</li>
                <li>• SEO-friendly structure</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-4">Quality Assurance</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Layout accuracy validation</li>
                <li>• Image quality optimization</li>
                <li>• Code validation checks</li>
                <li>• Performance optimization</li>
                <li>• Accessibility compliance</li>
                <li>• Mobile responsiveness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToHtml;
