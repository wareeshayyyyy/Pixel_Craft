import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import FileUpload from './FileUpload';
import DownloadButton from './DownloadButton';
import PDFService from '../../services/pdfService';
import { getErrorMessage } from '../../utils/errorUtils';

// Constants
const SUPPORTED_FORMATS = {
  PPTX: 'pptx',
  PPT: 'ppt'
};

const DEFAULT_SETTINGS = {
  format: SUPPORTED_FORMATS.PPTX,
  slidePerPage: true,
  preserveImages: true,
  quality: 'high'
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_MIME_TYPES = ['application/pdf'];

// Custom hook for conversion state management
const useConversionState = () => {
  const [state, setState] = useState({
    files: [],
    isProcessing: false,
    result: null,
    processedFile: null,
    error: null,
    progress: 0
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      files: [],
      isProcessing: false,
      result: null,
      processedFile: null,
      error: null,
      progress: 0
    });
  }, []);

  return [state, updateState, resetState];
};

// Utility functions
const validateFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return errors;
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    errors.push('File must be a PDF document');
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  if (file.size === 0) {
    errors.push('File appears to be empty');
  }

  return errors;
};

const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Error boundary component
class ConversionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PDF Conversion Error:', error, errorInfo);
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
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ConversionErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// Settings component
const ConversionSettings = ({ settings, onSettingsChange, disabled = false }) => {
  const handleSettingChange = useCallback((key, value) => {
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  }, [onSettingsChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Conversion Settings
      </h3>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="format-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Output Format
          </label>
          <select
            id="format-select"
            value={settings.format}
            onChange={(e) => handleSettingChange('format', e.target.value)}
            disabled={disabled}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-describedby="format-help"
          >
            <option value={SUPPORTED_FORMATS.PPTX}>PowerPoint (.pptx)</option>
            <option value={SUPPORTED_FORMATS.PPT}>PowerPoint 97-2003 (.ppt)</option>
          </select>
          <p id="format-help" className="text-xs text-gray-500 mt-1">
            Choose your preferred PowerPoint format
          </p>
        </div>

        <div>
          <label 
            htmlFor="quality-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image Quality
          </label>
          <select
            id="quality-select"
            value={settings.quality}
            onChange={(e) => handleSettingChange('quality', e.target.value)}
            disabled={disabled}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="high">High Quality</option>
            <option value="medium">Medium Quality</option>
            <option value="low">Low Quality (Smaller File)</option>
          </select>
        </div>

        <fieldset disabled={disabled} className="space-y-3">
          <legend className="text-sm font-medium text-gray-700 mb-3">
            Conversion Options
          </legend>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.slidePerPage}
              onChange={(e) => handleSettingChange('slidePerPage', e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded disabled:cursor-not-allowed"
              aria-describedby="slide-per-page-help"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                One Slide per PDF Page
              </span>
              <p id="slide-per-page-help" className="text-xs text-gray-500">
                Creates a separate slide for each page in the PDF
              </p>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.preserveImages}
              onChange={(e) => handleSettingChange('preserveImages', e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded disabled:cursor-not-allowed"
              aria-describedby="preserve-images-help"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Preserve Images and Graphics
              </span>
              <p id="preserve-images-help" className="text-xs text-gray-500">
                Maintains image quality and embedded graphics
              </p>
            </div>
          </label>
        </fieldset>
      </div>
    </div>
  );
};

ConversionSettings.propTypes = {
  settings: PropTypes.shape({
    format: PropTypes.string.isRequired,
    slidePerPage: PropTypes.bool.isRequired,
    preserveImages: PropTypes.bool.isRequired,
    quality: PropTypes.string.isRequired
  }).isRequired,
  onSettingsChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// Progress indicator component
const ProgressIndicator = ({ progress, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Conversion Progress
      </h3>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Conversion progress: ${progress}%`}
        />
      </div>
      <p className="text-sm text-gray-600 text-center">
        {progress < 25 && 'Analyzing PDF structure...'}
        {progress >= 25 && progress < 50 && 'Extracting content...'}
        {progress >= 50 && progress < 75 && 'Converting to PowerPoint...'}
        {progress >= 75 && progress < 100 && 'Finalizing presentation...'}
        {progress === 100 && 'Conversion complete!'}
      </p>
    </div>
  );
};

ProgressIndicator.propTypes = {
  progress: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired
};

// File info component
const FileInfo = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Selected File:</h4>
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between bg-white rounded p-3 shadow-sm">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)} • Last modified: {new Date(file.lastModified).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => onRemoveFile(index)}
            className="ml-4 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
            aria-label={`Remove ${file.name}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

FileInfo.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRemoveFile: PropTypes.func.isRequired
};

// Main component
const PdfToPpt = () => {
  const [conversionSettings, setConversionSettings] = useState(DEFAULT_SETTINGS);
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

  // File selection handler with validation
  const handleFilesSelected = useCallback((selectedFiles) => {
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    });

    updateConversionState({
      files: validFiles,
      error: errors.length > 0 ? getErrorMessage(`File validation failed: ${errors.join('; ')}`) : null,
      result: null,
      processedFile: null
    });
  }, [updateConversionState]);

  // Remove file handler
  const handleRemoveFile = useCallback((index) => {
    updateConversionState({
      files: conversionState.files.filter((_, i) => i !== index),
      result: null,
      processedFile: null,
      error: null
    });
  }, [conversionState.files, updateConversionState]);

  // Progress simulation
  const simulateProgress = useCallback(() => {
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 95) {
        progress = 95;
        clearInterval(progressIntervalRef.current);
      }
      updateConversionState({ progress: Math.min(progress, 95) });
    }, 500);
  }, [updateConversionState]);

  // Conversion handler with comprehensive error handling
  const handleConvert = useCallback(async () => {
    const { files } = conversionState;
    
    if (files.length === 0) {
      updateConversionState({
        error: getErrorMessage('Please select a PDF file to convert'),
        result: null
      });
      return;
    }

    const file = files[0];
    const validationErrors = validateFile(file);
    
    if (validationErrors.length > 0) {
      updateConversionState({
        error: getErrorMessage(`File validation failed: ${validationErrors.join(', ')}`),
        result: null
      });
      return;
    }

    // Create new abort controller for this conversion
    abortControllerRef.current = new AbortController();
    
    updateConversionState({
      isProcessing: true,
      processedFile: null,
      error: null,
      result: null,
      progress: 0
    });

    simulateProgress();

    try {
      // Enhanced conversion settings
      const enhancedSettings = {
        ...conversionSettings,
        fileName: sanitizeFileName(file.name),
        fileSize: file.size,
        signal: abortControllerRef.current.signal
      };

      const blob = await PDFService.convertToPpt(file, enhancedSettings);
      
      if (!blob || blob.size === 0) {
        throw new Error('Conversion resulted in empty file');
      }

      const processedFileName = sanitizeFileName(
        file.name.replace(/\.pdf$/i, '')
      );

      updateConversionState({
        processedFile: {
          data: blob,
          fileName: processedFileName,
          format: conversionSettings.format,
          originalSize: file.size,
          convertedSize: blob.size
        },
        result: 'PDF converted to PowerPoint successfully!',
        progress: 100
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        updateConversionState({
          error: 'Conversion was cancelled',
          result: null
        });
      } else {
        console.error('PDF Conversion Error:', error);
        updateConversionState({
          error: getErrorMessage(error),
          result: null
        });
      }
    } finally {
      updateConversionState({ isProcessing: false });
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [conversionState, conversionSettings, updateConversionState, simulateProgress]);

  // Cancel conversion handler
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

  // Reset handler
  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    resetConversionState();
  }, [resetConversionState]);

  const { files, isProcessing, result, processedFile, error, progress } = conversionState;

  return (
    <ConversionErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF to PowerPoint Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your PDF documents to PowerPoint presentations with 
            professional quality and customizable settings
          </p>
        </header>

        {/* File Upload Section */}
        <section aria-labelledby="upload-section">
          <h2 id="upload-section" className="sr-only">File Upload</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptedTypes=".pdf"
              multiple={false}
              maxFiles={1}
              maxFileSize={MAX_FILE_SIZE}
              title="Upload PDF File"
              description="Select a PDF file to convert to PowerPoint (Max 50MB)"
              disabled={isProcessing}
            />
            <FileInfo 
              files={files} 
              onRemoveFile={handleRemoveFile}
            />
          </div>
        </section>

        {/* Conversion Settings */}
        <section aria-labelledby="settings-section">
          <h2 id="settings-section" className="sr-only">Conversion Settings</h2>
          <ConversionSettings
            settings={conversionSettings}
            onSettingsChange={setConversionSettings}
            disabled={isProcessing}
          />
        </section>

        {/* Progress Indicator */}
        <ProgressIndicator 
          progress={progress} 
          isVisible={isProcessing}
        />

        {/* Action Buttons */}
        <section aria-labelledby="actions-section" className="text-center mb-6">
          <h2 id="actions-section" className="sr-only">Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || isProcessing}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-describedby="convert-help"
            >
              {isProcessing ? 'Converting...' : 'Convert to PowerPoint'}
            </button>

            {isProcessing && (
              <button
                onClick={handleCancelConversion}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
            )}

            {(result || error || processedFile) && !isProcessing && (
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Convert Another File
              </button>
            )}

            {processedFile && !isProcessing && (
              <DownloadButton
                downloadData={processedFile.data}
                fileName={processedFile.fileName}
                fileExtension={processedFile.format}
                isProcessing={isProcessing}
                variant="success"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              />
            )}
          </div>
          
          <p id="convert-help" className="text-xs text-gray-500 mt-2">
            {files.length === 0 
              ? 'Please upload a PDF file to begin conversion'
              : 'Click to start the conversion process'
            }
          </p>
        </section>

        {/* Results Section */}
        {(result || error) && (
          <section aria-labelledby="results-section">
            <h2 id="results-section" className="sr-only">Conversion Results</h2>
            <div className={`rounded-lg p-6 border-2 ${
              error 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${
                  error ? 'text-red-600' : 'text-green-600'
                }`}>
                  {error ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    error ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {error || result}
                  </p>
                  
                  {processedFile && !error && (
                    <div className="mt-3 text-sm text-green-700">
                      <p>
                        <strong>Original size:</strong> {formatFileSize(processedFile.originalSize)}
                      </p>
                      <p>
                        <strong>Converted size:</strong> {formatFileSize(processedFile.convertedSize)}
                      </p>
                      <p>
                        <strong>Format:</strong> {processedFile.format.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Help Section */}
        <section aria-labelledby="help-section" className="mt-12">
          <h2 id="help-section" className="text-xl font-semibold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload PDF</h3>
                <p className="text-sm text-gray-600">
                  Select your PDF file (up to 50MB)
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Configure</h3>
                <p className="text-sm text-gray-600">
                  Choose your preferred settings
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Download</h3>
                <p className="text-sm text-gray-600">
                  Get your PowerPoint presentation
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ConversionErrorBoundary>
  );
};

export default PdfToPpt;