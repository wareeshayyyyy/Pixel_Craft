import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import FileUpload from './FileUpload';
import { DownloadPdfButton } from './DownloadButton';

// Constants
const CONVERSION_TYPES = {
  FILE: 'file',
  URL: 'url',
  HTML_CODE: 'html_code'
};

const PDF_FORMATS = {
  A4: 'A4',
  LETTER: 'Letter',
  LEGAL: 'Legal',
  A3: 'A3'
};

const PDF_ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape'
};

const QUALITY_SETTINGS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

const DEFAULT_SETTINGS = {
  format: PDF_FORMATS.A4,
  orientation: PDF_ORIENTATIONS.PORTRAIT,
  quality: QUALITY_SETTINGS.HIGH,
  margins: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  },
  includeBackground: true,
  waitForLoad: true,
  scale: 1.0
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 20;
const ACCEPTED_MIME_TYPES = ['text/html', 'text/plain'];
const ACCEPTED_EXTENSIONS = ['.html', '.htm'];

// Custom hooks
const useConversionState = () => {
  const [state, setState] = useState({
    files: [],
    url: '',
    htmlCode: '',
    conversionType: CONVERSION_TYPES.FILE,
    isProcessing: false,
    result: null,
    processedFiles: [],
    error: null,
    progress: 0,
    warnings: []
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      files: [],
      url: '',
      htmlCode: '',
      conversionType: CONVERSION_TYPES.FILE,
      isProcessing: false,
      result: null,
      processedFiles: [],
      error: null,
      progress: 0,
      warnings: []
    });
  }, []);

  return [state, updateState, resetState];
};

// Utility functions
const validateFile = (file) => {
  const errors = [];
  const warnings = [];
  
  if (!file) {
    errors.push('No file provided');
    return { errors, warnings };
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.type) && 
      !ACCEPTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
    errors.push('File must be an HTML document (.html or .htm)');
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  if (file.size === 0) {
    errors.push('File appears to be empty');
  }

  if (file.size > 1024 * 1024) { // 1MB
    warnings.push('Large HTML file may take longer to process');
  }

  return { errors, warnings };
};

const validateUrl = (url) => {
  const errors = [];
  const warnings = [];

  if (!url || !url.trim()) {
    errors.push('URL is required');
    return { errors, warnings };
  }

  try {
    const urlObj = new URL(url);
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL must use HTTP or HTTPS protocol');
    }

    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      warnings.push('Local URLs may not be accessible from the server');
    }

  } catch (error) {
    errors.push('Invalid URL format');
  }

  return { errors, warnings };
};

const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 100); // Limit length
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Error boundary
class HtmlToPdfErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HTML to PDF Conversion Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Conversion Error</h3>
          <p className="text-red-600 mb-4">
            An unexpected error occurred during the conversion process.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reset Converter
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

HtmlToPdfErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// Conversion type selector
const ConversionTypeSelector = ({ conversionType, onTypeChange, disabled = false }) => {
  const types = [
    {
      value: CONVERSION_TYPES.FILE,
      label: 'HTML Files',
      description: 'Upload HTML files from your computer',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      value: CONVERSION_TYPES.URL,
      label: 'Web URL',
      description: 'Convert a webpage directly from URL',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      value: CONVERSION_TYPES.HTML_CODE,
      label: 'HTML Code',
      description: 'Paste HTML code directly',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Choose Conversion Method
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {types.map((type) => (
          <label
            key={type.value}
            className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              conversionType === type.value
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              value={type.value}
              checked={conversionType === type.value}
              onChange={(e) => onTypeChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <div className="flex items-center mb-2">
              <span className={`${
                conversionType === type.value ? 'text-green-600' : 'text-gray-400'
              }`}>
                {type.icon}
              </span>
              <span className="ml-2 font-medium text-gray-900">{type.label}</span>
            </div>
            <p className="text-sm text-gray-600">{type.description}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

ConversionTypeSelector.propTypes = {
  conversionType: PropTypes.string.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// PDF settings component
const PdfSettings = ({ settings, onSettingsChange, disabled = false }) => {
  const handleSettingChange = useCallback((key, value) => {
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  }, [onSettingsChange]);

  const handleMarginChange = useCallback((side, value) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    onSettingsChange(prev => ({
      ...prev,
      margins: { ...prev.margins, [side]: numValue }
    }));
  }, [onSettingsChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        PDF Settings
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="page-format" className="block text-sm font-medium text-gray-700 mb-2">
              Page Format
            </label>
            <select
              id="page-format"
              value={settings.format}
              onChange={(e) => handleSettingChange('format', e.target.value)}
              disabled={disabled}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            >
              {Object.entries(PDF_FORMATS).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="orientation" className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <select
              id="orientation"
              value={settings.orientation}
              onChange={(e) => handleSettingChange('orientation', e.target.value)}
              disabled={disabled}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            >
              {Object.entries(PDF_ORIENTATIONS).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <select
              id="quality"
              value={settings.quality}
              onChange={(e) => handleSettingChange('quality', e.target.value)}
              disabled={disabled}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            >
              <option value={QUALITY_SETTINGS.HIGH}>High Quality</option>
              <option value={QUALITY_SETTINGS.MEDIUM}>Medium Quality</option>
              <option value={QUALITY_SETTINGS.LOW}>Low Quality (Smaller File)</option>
            </select>
          </div>

          <div>
            <label htmlFor="scale" className="block text-sm font-medium text-gray-700 mb-2">
              Scale ({settings.scale}x)
            </label>
            <input
              id="scale"
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.scale}
              onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5x</span>
              <span>1.0x</span>
              <span>2.0x</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Margins (mm)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(settings.margins).map(([side, value]) => (
                <div key={side}>
                  <label htmlFor={`margin-${side}`} className="block text-xs text-gray-600 mb-1">
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </label>
                  <input
                    id={`margin-${side}`}
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleMarginChange(side, e.target.value)}
                    disabled={disabled}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>

          <fieldset disabled={disabled} className="space-y-3">
            <legend className="text-sm font-medium text-gray-700 mb-3">
              Advanced Options
            </legend>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeBackground}
                onChange={(e) => handleSettingChange('includeBackground', e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Include Background Graphics
                </span>
                <p className="text-xs text-gray-500">
                  Preserve background colors and images
                </p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.waitForLoad}
                onChange={(e) => handleSettingChange('waitForLoad', e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Wait for Content Load
                </span>
                <p className="text-xs text-gray-500">
                  Wait for images and scripts to load completely
                </p>
              </div>
            </label>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

PdfSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// Progress component
const ConversionProgress = ({ progress, isVisible, currentFile = null }) => {
  if (!isVisible) return null;

  const getProgressMessage = (progress) => {
    if (progress < 20) return 'Initializing conversion...';
    if (progress < 40) return 'Processing HTML content...';
    if (progress < 60) return 'Rendering PDF pages...';
    if (progress < 80) return 'Optimizing output...';
    if (progress < 100) return 'Finalizing PDF...';
    return 'Conversion complete!';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Conversion Progress
      </h3>
      {currentFile && (
        <p className="text-sm text-gray-600 mb-3">
          Converting: <span className="font-medium">{currentFile}</span>
        </p>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-green-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Conversion progress: ${progress}%`}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {getProgressMessage(progress)}
        </p>
        <span className="text-sm font-medium text-gray-900">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

ConversionProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  currentFile: PropTypes.string
};

// URL input component
const UrlInput = ({ url, onUrlChange, disabled = false, error = null }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [urlPreview, setUrlPreview] = useState(null);

  const handleUrlBlur = useCallback(async () => {
    if (!url.trim()) return;
    
    setIsValidating(true);
    try {
      // Simple URL validation and preview
      const urlObj = new URL(url);
      setUrlPreview({
        hostname: urlObj.hostname,
        protocol: urlObj.protocol,
        pathname: urlObj.pathname
      });
    } catch (error) {
      setUrlPreview(null);
    } finally {
      setIsValidating(false);
    }
  }, [url]);

  return (
    <div>
      <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
        Website URL
      </label>
      <div className="relative">
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onBlur={handleUrlBlur}
          disabled={disabled}
          placeholder="https://example.com"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          aria-describedby="url-help"
          aria-invalid={!!error}
        />
        {isValidating && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          </div>
        )}
      </div>
      
      {urlPreview && !error && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Preview:</span> {urlPreview.hostname}{urlPreview.pathname}
          </p>
        </div>
      )}
      
      <p id="url-help" className="text-sm text-gray-500 mt-2">
        Enter the complete URL of the webpage you want to convert to PDF
      </p>
      
      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

UrlInput.propTypes = {
  url: PropTypes.string.isRequired,
  onUrlChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string
};

// HTML code input component
const HtmlCodeInput = ({ htmlCode, onHtmlCodeChange, disabled = false }) => {
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setLineCount(htmlCode.split('\n').length);
  }, [htmlCode]);

  return (
    <div>
      <label htmlFor="html-code" className="block text-sm font-medium text-gray-700 mb-2">
        HTML Code
      </label>
      <div className="relative">
        <textarea
          id="html-code"
          value={htmlCode}
          onChange={(e) => onHtmlCodeChange(e.target.value)}
          disabled={disabled}
          placeholder="<!DOCTYPE html>
<html>
<head>
    <title>My Document</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>"
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows="12"
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
          {lineCount} lines
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Paste your HTML code here. CSS and inline styles are supported.
      </p>
    </div>
  );
};

HtmlCodeInput.propTypes = {
  htmlCode: PropTypes.string.isRequired,
  onHtmlCodeChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// File info display
const FileInfo = ({ files, onRemoveFile, disabled = false }) => {
  if (files.length === 0) return null;

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Selected Files ({files.length}/{MAX_FILES})
        </h4>
        <span className="text-xs text-gray-500">
          Total: {formatFileSize(totalSize)}
        </span>
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {files.map((file, index) => {
          const validation = validateFile(file);
          const hasErrors = validation.errors.length > 0;
          
          return (
            <div 
              key={`${file.name}-${index}`} 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                hasErrors ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className={`flex-shrink-0 mr-3 ${
                  hasErrors ? 'text-red-500' : 'text-green-500'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${
                    hasErrors ? 'text-red-900' : 'text-gray-900'
                  }`}>
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • Modified: {new Date(file.lastModified).toLocaleDateString()}
                  </div>
                  {hasErrors && (
                    <div className="text-xs text-red-600 mt-1">
                      {validation.errors.join(', ')}
                    </div>
                  )}
                  {validation.warnings.length > 0 && (
                    <div className="text-xs text-yellow-600 mt-1">
                      {validation.warnings.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                disabled={disabled}
                className="ml-4 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Remove ${file.name}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

FileInfo.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// Results display component
const ConversionResults = ({ result, error, processedFiles, warnings = [] }) => {
  if (!result && !error && processedFiles.length === 0) return null;

  return (
    <section aria-labelledby="results-section" className="mb-6">
      <h2 id="results-section" className="sr-only">Conversion Results</h2>
      
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Warnings</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800 mb-1">Conversion Failed</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message and File Info */}
      {result && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-medium text-green-800 mb-1">Conversion Successful</h4>
              <p className="text-sm text-green-700 mb-3">{result}</p>
              
              {processedFiles.length > 0 && (
                <div className="space-y-2">
                  {processedFiles.map((file, index) => (
                    <div key={index} className="bg-white rounded p-3 border border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.fileName}.pdf
                          </p>
                          <p className="text-xs text-gray-600">
                            Size: {formatFileSize(file.data.size)} • 
                            Pages: {file.pageCount || 'Unknown'} • 
                            Created: {new Date().toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          PDF
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

ConversionResults.propTypes = {
  result: PropTypes.string,
  error: PropTypes.string,
  processedFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  warnings: PropTypes.arrayOf(PropTypes.string)
};

// Main component
const HtmlToPdf = () => {
  const [pdfSettings, setPdfSettings] = useState(DEFAULT_SETTINGS);
  const [conversionState, updateConversionState, resetConversionState] = useConversionState();
  const abortControllerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Memoized validation
  const validation = useMemo(() => {
    const { conversionType, files, url, htmlCode } = conversionState;
    let errors = [];
    let warnings = [];

    switch (conversionType) {
      case CONVERSION_TYPES.FILE:
        if (files.length === 0) {
          errors.push('Please select HTML files to convert');
        } else {
          files.forEach(file => {
            const fileValidation = validateFile(file);
            errors.push(...fileValidation.errors);
            warnings.push(...fileValidation.warnings);
          });
        }
        break;
      
      case CONVERSION_TYPES.URL:
        const urlValidation = validateUrl(url);
        errors.push(...urlValidation.errors);
        warnings.push(...urlValidation.warnings);
        break;
      
      case CONVERSION_TYPES.HTML_CODE:
        if (!htmlCode.trim()) {
          errors.push('Please enter HTML code to convert');
        } else if (!htmlCode.includes('<html') && !htmlCode.includes('<HTML')) {
          warnings.push('HTML code should include proper HTML structure');
        }
        break;
    }

    return { errors, warnings, isValid: errors.length === 0 };
  }, [conversionState]);

  // File selection handler
  const handleFilesSelected = useCallback((selectedFiles) => {
    const validFiles = selectedFiles.slice(0, MAX_FILES);
    updateConversionState({
      files: validFiles,
      error: null,
      result: null,
      processedFiles: []
    });
  }, [updateConversionState]);

  // Remove file handler
  const handleRemoveFile = useCallback((index) => {
    updateConversionState({
      files: conversionState.files.filter((_, i) => i !== index),
      error: null,
      result: null,
      processedFiles: []
    });
  }, [conversionState.files, updateConversionState]);

  // Conversion type change handler
  const handleConversionTypeChange = useCallback((type) => {
    updateConversionState({
      conversionType: type,
      error: null,
      result: null,
      processedFiles: []
    });
  }, [updateConversionState]);

  // URL change handler
  const handleUrlChange = useCallback((newUrl) => {
    updateConversionState({
      url: newUrl,
      error: null,
      result: null,
      processedFiles: []
    });
  }, [updateConversionState]);

  // HTML code change handler
  const handleHtmlCodeChange = useCallback((code) => {
    updateConversionState({
      htmlCode: code,
      error: null,
      result: null,
      processedFiles: []
    });
  }, [updateConversionState]);

  // Progress simulation
  const simulateProgress = useCallback((fileCount = 1) => {
    let progress = 0;
    const increment = 100 / (fileCount * 20); // Adjust based on file count
    
    progressIntervalRef.current = setInterval(() => {
      progress += increment + Math.random() * increment;
      if (progress > 95) {
        progress = 95;
        clearInterval(progressIntervalRef.current);
      }
      updateConversionState({ progress: Math.min(progress, 95) });
    }, 200);
  }, [updateConversionState]);

  // Main conversion handler
  const handleConvertToPdf = useCallback(async () => {
    const { conversionType, files, url, htmlCode } = conversionState;
    
    if (!validation.isValid) {
      updateConversionState({
        error: validation.errors[0],
        result: null
      });
      return;
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    updateConversionState({
      isProcessing: true,
      processedFiles: [],
      error: null,
      result: null,
      progress: 0,
      warnings: validation.warnings
    });

    const fileCount = conversionType === CONVERSION_TYPES.FILE ? files.length : 1;
    simulateProgress(fileCount);

    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const formData = new FormData();
      let endpoint = '';
      let resultFileName = '';

      // Prepare request based on conversion type
      switch (conversionType) {
        case CONVERSION_TYPES.FILE:
          endpoint = 'html-to-pdf';
          files.forEach((file) => {
            formData.append('files', file);
          });
          resultFileName = files.length === 1 
            ? sanitizeFileName(files[0].name.replace(/\.(html?|htm)$/i, ''))
            : 'converted_html_files';
          break;
          
        case CONVERSION_TYPES.URL:
          endpoint = 'url-to-pdf';
          formData.append('url', url.trim());
          resultFileName = sanitizeFileName(new URL(url).hostname);
          break;
          
        case CONVERSION_TYPES.HTML_CODE:
          endpoint = 'html-code-to-pdf';
          formData.append('htmlCode', htmlCode);
          resultFileName = 'custom_html_document';
          break;
      }

      // Add PDF settings to form data
      formData.append('settings', JSON.stringify(pdfSettings));

      const response = await fetch(`${base}/api/${endpoint}`, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Conversion resulted in empty PDF file');
      }

      // Extract metadata from response headers if available
      const contentLength = response.headers.get('content-length');
      const pageCount = response.headers.get('x-pdf-page-count');

      const processedFile = {
        data: blob,
        fileName: resultFileName,
        originalSize: conversionType === CONVERSION_TYPES.FILE 
          ? files.reduce((sum, file) => sum + file.size, 0)
          : htmlCode.length || 0,
        convertedSize: blob.size,
        pageCount: pageCount ? parseInt(pageCount) : null,
        conversionType,
        settings: pdfSettings
      };

      updateConversionState({
        processedFiles: [processedFile],
        result: `Successfully converted ${
          conversionType === CONVERSION_TYPES.FILE 
            ? `${files.length} HTML file(s)` 
            : conversionType === CONVERSION_TYPES.URL 
              ? 'webpage' 
              : 'HTML code'
        } to PDF!`,
        progress: 100
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        updateConversionState({
          error: 'Conversion was cancelled by user',
          result: null
        });
      } else {
        console.error('HTML to PDF Conversion Error:', error);
        updateConversionState({
          error: `Conversion failed: ${error.message}`,
          result: null
        });
      }
    } finally {
      updateConversionState({ isProcessing: false });
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [conversionState, pdfSettings, validation, simulateProgress]);

  // Cancel conversion
  const handleCancelConversion = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    updateConversionState({
      isProcessing: false,
      progress: 0,
      error: 'Conversion cancelled by user'
    });
  }, [updateConversionState]);

  // Reset everything
  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    resetConversionState();
  }, [resetConversionState]);

  const {
    files,
    url,
    htmlCode,
    conversionType,
    isProcessing,
    result,
    processedFiles,
    error,
    progress,
    warnings
  } = conversionState;

  return (
    <HtmlToPdfErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HTML to PDF Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert HTML files, web pages, or HTML code to professional PDF documents 
            with customizable formatting and layout options
          </p>
        </header>

        {/* Conversion Type Selection */}
        <ConversionTypeSelector
          conversionType={conversionType}
          onTypeChange={handleConversionTypeChange}
          disabled={isProcessing}
        />

        {/* Input Section */}
        <section aria-labelledby="input-section">
          <h2 id="input-section" className="sr-only">Input Selection</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {conversionType === CONVERSION_TYPES.FILE && (
              <>
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  acceptedTypes=".html,.htm"
                  multiple={true}
                  maxFiles={MAX_FILES}
                  maxFileSize={MAX_FILE_SIZE}
                  title="Upload HTML Files"
                  description={`Select HTML files (.html or .htm) to convert to PDF (Max ${MAX_FILES} files, ${MAX_FILE_SIZE / (1024 * 1024)}MB each)`}
                  disabled={isProcessing}
                />
                <FileInfo 
                  files={files} 
                  onRemoveFile={handleRemoveFile}
                  disabled={isProcessing}
                />
              </>
            )}

            {conversionType === CONVERSION_TYPES.URL && (
              <UrlInput
                url={url}
                onUrlChange={handleUrlChange}
                disabled={isProcessing}
                error={validation.errors.find(err => err.includes('URL')) || null}
              />
            )}

            {conversionType === CONVERSION_TYPES.HTML_CODE && (
              <HtmlCodeInput
                htmlCode={htmlCode}
                onHtmlCodeChange={handleHtmlCodeChange}
                disabled={isProcessing}
              />
            )}
          </div>
        </section>

        {/* PDF Settings */}
        <section aria-labelledby="settings-section">
          <h2 id="settings-section" className="sr-only">PDF Settings</h2>
          <PdfSettings
            settings={pdfSettings}
            onSettingsChange={setPdfSettings}
            disabled={isProcessing}
          />
        </section>

        {/* Progress Indicator */}
        <ConversionProgress 
          progress={progress} 
          isVisible={isProcessing}
          currentFile={
            conversionType === CONVERSION_TYPES.FILE && files.length > 0 
              ? files[0].name 
              : null
          }
        />

        {/* Action Buttons */}
        <section aria-labelledby="actions-section" className="text-center mb-6">
          <h2 id="actions-section" className="sr-only">Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleConvertToPdf}
              disabled={!validation.isValid || isProcessing}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              aria-describedby="convert-help"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              {isProcessing ? 'Converting...' : 'Convert to PDF'}
            </button>

            {isProcessing && (
              <button
                onClick={handleCancelConversion}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
            )}

            {(result || error || processedFiles.length > 0) && !isProcessing && (
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Convert Another
              </button>
            )}

            {processedFiles.length > 0 && !isProcessing && (
              <div className="flex flex-wrap gap-2">
                {processedFiles.map((file, index) => (
                  <DownloadPdfButton
                    key={index}
                    downloadData={file.data}
                    fileName={file.fileName}
                    isProcessing={isProcessing}
                    variant="success"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  />
                ))}
              </div>
            )}
          </div>
          
          <p id="convert-help" className="text-sm text-gray-500 mt-3">
            {!validation.isValid 
              ? `Please fix the following: ${validation.errors.join(', ')}`
              : 'Click to start the PDF conversion process'
            }
          </p>
        </section>

        {/* Results Section */}
        <ConversionResults
          result={result}
          error={error}
          processedFiles={processedFiles}
          warnings={warnings}
        />

        {/* Tips and Help Section */}
        <section aria-labelledby="help-section" className="mt-12">
          <h2 id="help-section" className="text-xl font-semibold text-gray-900 mb-6">
            Tips for Best Results
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                HTML Files
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Ensure CSS files are linked properly or use inline styles</li>
                <li>• Images should use absolute paths or be embedded as base64</li>
                <li>• Test your HTML in a browser before converting</li>
                <li>• Avoid complex JavaScript that requires user interaction</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Web URLs
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Use publicly accessible URLs (not behind login)</li>
                <li>• HTTPS URLs are preferred for security</li>
                <li>• Pages with heavy JavaScript may need loading time</li>
                <li>• Some websites may block automated access</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: 1, title: 'Select Input', desc: 'Choose files, URL, or HTML code' },
                { step: 2, title: 'Configure PDF', desc: 'Set format, margins, and quality' },
                { step: 3, title: 'Convert', desc: 'Process and generate PDF' },
                { step: 4, title: 'Download', desc: 'Get your PDF document' }
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-sm">{step}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics */}
        {processedFiles.length > 0 && (
          <section aria-labelledby="stats-section" className="mt-8">
            <h2 id="stats-section" className="text-lg font-semibold text-gray-900 mb-4">
              Conversion Statistics
            </h2>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {processedFiles.length}
                  </p>
                  <p className="text-sm text-gray-600">Files Converted</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {processedFiles.reduce((sum, file) => sum + (file.pageCount || 0), 0) || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Total Pages</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatFileSize(processedFiles.reduce((sum, file) => sum + file.originalSize, 0))}
                  </p>
                  <p className="text-sm text-gray-600">Original Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatFileSize(processedFiles.reduce((sum, file) => sum + file.convertedSize, 0))}
                  </p>
                  <p className="text-sm text-gray-600">PDF Size</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </HtmlToPdfErrorBoundary>
  );
};

export default HtmlToPdf;