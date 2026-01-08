import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import FileUpload from './FileUpload';
import DownloadPdfButton from './DownloadButton';
import { getErrorMessage } from '../../utils/errorUtils';
import PDFService from '../../services/pdfService';

// Constants
const MAX_FILES = 50;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB total
const ACCEPTED_MIME_TYPES = ['application/pdf'];

const MERGE_OPTIONS = {
  SIMPLE: 'simple',
  WITH_BOOKMARKS: 'with_bookmarks',
  WITH_TOC: 'with_toc'
};

const DEFAULT_MERGE_SETTINGS = {
  mergeType: MERGE_OPTIONS.SIMPLE,
  preserveBookmarks: true,
  addPageNumbers: false,
  generateTOC: false,
  outputFileName: 'merged_document'
};

// Custom hooks
const useMergeState = () => {
  const [state, setState] = useState({
    files: [],
    isProcessing: false,
    result: null,
    processedFile: null,
    error: null,
    warnings: [],
    progress: 0,
    currentOperation: null
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
      warnings: [],
      progress: 0,
      currentOperation: null
    });
  }, []);

  return [state, updateState, resetState];
};

// Utility functions
const validatePdfFile = (file) => {
  const errors = [];
  const warnings = [];
  
  if (!file) {
    errors.push('No file provided');
    return { errors, warnings };
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
    errors.push('File must be a PDF document');
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  if (file.size === 0) {
    errors.push('File appears to be empty or corrupted');
  }

  if (file.size > 50 * 1024 * 1024) { // 50MB
    warnings.push('Large PDF file may take longer to process');
  }

  return { errors, warnings };
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 100);
};

// Error boundary
class MergePdfErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PDF Merge Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Merge Error</h3>
          <p className="text-red-600 mb-4">
            An unexpected error occurred during the PDF merge process.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reset Merger
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

MergePdfErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// Draggable file item component
const DraggableFileItem = ({ 
  file, 
  index, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast, 
  disabled = false,
  validation 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const hasErrors = validation.errors.length > 0;

  const handleDragStart = (e) => {
    if (disabled) return;
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable={!disabled && !hasErrors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        hasErrors 
          ? 'bg-red-50 border-red-200' 
          : isDragging 
            ? 'bg-blue-50 border-blue-300 shadow-lg' 
            : 'bg-white border-gray-200 hover:border-gray-300'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      {/* Drag Handle */}
      <div className={`flex-shrink-0 mr-3 cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${
        disabled || hasErrors ? 'cursor-not-allowed text-gray-300' : 'text-gray-400 hover:text-gray-600'
      }`}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm2 2a1 1 0 000 2h4a1 1 0 100-2H8zm0 4a1 1 0 000 2h4a1 1 0 100-2H8z" />
        </svg>
      </div>

      {/* Order Number */}
      <div className="flex-shrink-0 mr-4">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
          hasErrors 
            ? 'bg-red-100 text-red-600' 
            : 'bg-blue-100 text-blue-600'
        }`}>
          {index + 1}
        </span>
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center mb-1">
          <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${
            hasErrors ? 'text-red-500' : 'text-red-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <h4 className={`text-sm font-medium truncate ${
            hasErrors ? 'text-red-900' : 'text-gray-900'
          }`}>
            {file.name}
          </h4>
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

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 ml-4">
        {/* Move Up */}
        <button
          onClick={() => onMoveUp(index)}
          disabled={disabled || isFirst || hasErrors}
          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Move ${file.name} up`}
          title="Move up"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Move Down */}
        <button
          onClick={() => onMoveDown(index)}
          disabled={disabled || isLast || hasErrors}
          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Move ${file.name} down`}
          title="Move down"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Remove */}
        <button
          onClick={() => onRemove(index)}
          disabled={disabled}
          className="p-1 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Remove ${file.name}`}
          title="Remove file"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

DraggableFileItem.propTypes = {
  file: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  validation: PropTypes.object.isRequired
};

// File list with drag and drop
const FileListManager = ({ files, onFilesChange, disabled = false }) => {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const totalSize = useMemo(() => {
    return files.reduce((sum, file) => sum + file.size, 0);
  }, [files]);

  const validFiles = useMemo(() => {
    return files.filter(file => validatePdfFile(file).errors.length === 0);
  }, [files]);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex || disabled) return;

    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(dragIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);
    onFilesChange(newFiles);
  }, [files, onFilesChange, disabled]);

  const handleRemoveFile = useCallback((index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  }, [files, onFilesChange]);

  const handleMoveUp = useCallback((index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const handleMoveDown = useCallback((index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const handleClearAll = useCallback(() => {
    onFilesChange([]);
  }, [onFilesChange]);

  if (files.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          PDF Files to Merge ({files.length}/{MAX_FILES})
        </h3>
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${
            totalSize > MAX_TOTAL_SIZE ? 'text-red-600 font-medium' : 'text-gray-600'
          }`}>
            Total: {formatFileSize(totalSize)}
            {totalSize > MAX_TOTAL_SIZE && (
              <span className="block text-xs">Exceeds limit!</span>
            )}
          </span>
          <button
            onClick={handleClearAll}
            disabled={disabled}
            className="text-sm text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1 disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center text-sm text-blue-800">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Drag files to reorder them, or use the up/down arrows. Files will be merged in the order shown.
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {files.map((file, index) => {
          const validation = validatePdfFile(file);
          
          return (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={`${
                dragOverIndex === index ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
              }`}
            >
              <DraggableFileItem
                file={file}
                index={index}
                onRemove={handleRemoveFile}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isFirst={index === 0}
                isLast={index === files.length - 1}
                disabled={disabled}
                validation={validation}
              />
            </div>
          );
        })}
      </div>

      {validFiles.length !== files.length && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> {files.length - validFiles.length} file(s) have errors and will be skipped during merge.
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div>
            <p className="font-medium text-gray-900">{validFiles.length}</p>
            <p className="text-gray-600">Valid Files</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">{files.length - validFiles.length}</p>
            <p className="text-gray-600">Invalid Files</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">{formatFileSize(totalSize)}</p>
            <p className="text-gray-600">Total Size</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {validFiles.length > 0 ? `~${Math.round(totalSize * 0.8 / (1024 * 1024))}MB` : '0MB'}
            </p>
            <p className="text-gray-600">Est. Output</p>
          </div>
        </div>
      </div>
    </div>
  );
};

FileListManager.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFilesChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// Merge settings component
const MergeSettings = ({ settings, onSettingsChange, disabled = false }) => {
  const handleSettingChange = useCallback((key, value) => {
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  }, [onSettingsChange]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Merge Settings
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="output-filename" className="block text-sm font-medium text-gray-700 mb-2">
              Output File Name
            </label>
            <input
              id="output-filename"
              type="text"
              value={settings.outputFileName}
              onChange={(e) => handleSettingChange('outputFileName', e.target.value)}
              disabled={disabled}
              placeholder="merged_document"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              File extension (.pdf) will be added automatically
            </p>
          </div>

          <div>
            <label htmlFor="merge-type" className="block text-sm font-medium text-gray-700 mb-2">
              Merge Type
            </label>
            <select
              id="merge-type"
              value={settings.mergeType}
              onChange={(e) => handleSettingChange('mergeType', e.target.value)}
              disabled={disabled}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            >
              <option value={MERGE_OPTIONS.SIMPLE}>Simple Merge</option>
              <option value={MERGE_OPTIONS.WITH_BOOKMARKS}>Preserve Bookmarks</option>
              <option value={MERGE_OPTIONS.WITH_TOC}>Generate Table of Contents</option>
            </select>
          </div>
        </div>

        <fieldset disabled={disabled} className="space-y-3">
          <legend className="text-sm font-medium text-gray-700 mb-3">
            Additional Options
          </legend>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.preserveBookmarks}
              onChange={(e) => handleSettingChange('preserveBookmarks', e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Preserve Original Bookmarks
              </span>
              <p className="text-xs text-gray-500">
                Keep bookmarks from individual PDF files
              </p>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.addPageNumbers}
              onChange={(e) => handleSettingChange('addPageNumbers', e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Add Page Numbers
              </span>
              <p className="text-xs text-gray-500">
                Add sequential page numbers to merged document
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.generateTOC}
              onChange={(e) => handleSettingChange('generateTOC', e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Generate Table of Contents
              </span>
              <p className="text-xs text-gray-500">
                Create TOC with links to each merged document
              </p>
            </div>
          </label>
        </fieldset>
      </div>
    </div>
  );
};

MergeSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// Progress component
const MergeProgress = ({ progress, isVisible, currentOperation = null, fileCount = 0 }) => {
  if (!isVisible) return null;

  const getProgressMessage = (progress, operation) => {
    if (operation) return operation;
    if (progress < 20) return 'Initializing merge process...';
    if (progress < 40) return 'Reading PDF files...';
    if (progress < 60) return 'Combining documents...';
    if (progress < 80) return 'Optimizing merged PDF...';
    if (progress < 100) return 'Finalizing document...';
    return 'Merge complete!';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Merge Progress
      </h3>
      
      {fileCount > 0 && (
        <p className="text-sm text-gray-600 mb-3">
          Merging <span className="font-medium">{fileCount} PDF files</span>
        </p>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Merge progress: ${progress}%`}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {getProgressMessage(progress, currentOperation)}
        </p>
        <span className="text-sm font-medium text-gray-900">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

MergeProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  currentOperation: PropTypes.string,
  fileCount: PropTypes.number
};

// Results component
const MergeResults = ({ result, error, processedFile, warnings = [] }) => {
  if (!result && !error && !processedFile) return null;

  return (
    <section aria-labelledby="results-section" className="mb-6">
      <h2 id="results-section" className="sr-only">Merge Results</h2>
      
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800 mb-1">Merge Failed</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {result && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-medium text-green-800 mb-1">Merge Successful</h4>
              <p className="text-sm text-green-700 mb-3">{result}</p>
              
              {processedFile && (
                <div className="bg-white rounded p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {processedFile.fileName}.pdf
                      </p>
                      <p className="text-xs text-gray-600">
                        Size: {formatFileSize(processedFile.data.size)} • 
                        Created: {new Date().toLocaleString()}
                        {processedFile.pageCount && ` • Pages: ${processedFile.pageCount}`}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      MERGED PDF
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

MergeResults.propTypes = {
  result: PropTypes.string,
  error: PropTypes.string,
  processedFile: PropTypes.object,
  warnings: PropTypes.arrayOf(PropTypes.string)
};

// Main component
const MergePdf = () => {
  const [mergeSettings, setMergeSettings] = useState(DEFAULT_MERGE_SETTINGS);
  const [mergeState, updateMergeState, resetMergeState] = useMergeState();
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

  // Validation
  const validation = useMemo(() => {
    const { files } = mergeState;
    let errors = [];
    let warnings = [];

    if (files.length < 2) {
      errors.push('Please select at least 2 PDF files to merge');
    }

    if (files.length > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} files allowed`);
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      errors.push(`Total file size exceeds ${MAX_TOTAL_SIZE / (1024 * 1024)}MB limit`);
    }

    let validFileCount = 0;
    files.forEach((file, index) => {
      const fileValidation = validatePdfFile(file);
      if (fileValidation.errors.length === 0) {
        validFileCount++;
      } else {
        errors.push(`File ${index + 1} (${file.name}): ${fileValidation.errors.join(', ')}`);
      }
      warnings.push(...fileValidation.warnings);
    });

    if (validFileCount < 2 && files.length >= 2) {
      errors.push('At least 2 valid PDF files are required for merging');
    }

    return { 
      errors: [...new Set(errors)], 
      warnings: [...new Set(warnings)], 
      isValid: errors.length === 0,
      validFileCount
    };
  }, [mergeState.files]);

  // File selection handler
  const handleFilesSelected = useCallback((selectedFiles) => {
    const limitedFiles = selectedFiles.slice(0, MAX_FILES);
    updateMergeState({
      files: limitedFiles,
      error: null,
      result: null,
      processedFile: null,
      warnings: []
    });
  }, [updateMergeState]);

  // File management handlers
  const handleFilesChange = useCallback((newFiles) => {
    updateMergeState({
      files: newFiles,
      error: null,
      result: null,
      processedFile: null
    });
  }, [updateMergeState]);

  // Progress simulation
  const simulateProgress = useCallback((fileCount) => {
    let progress = 0;
    const operations = [
      'Reading PDF files...',
      'Analyzing document structure...',
      'Merging pages...',
      'Optimizing output...',
      'Finalizing document...'
    ];
    let currentOpIndex = 0;
    
    updateMergeState({ currentOperation: operations[0] });
    
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * (100 / (fileCount * 2));
      
      const newOpIndex = Math.floor((progress / 100) * operations.length);
      if (newOpIndex !== currentOpIndex && newOpIndex < operations.length) {
        currentOpIndex = newOpIndex;
        updateMergeState({ currentOperation: operations[currentOpIndex] });
      }
      
      if (progress > 95) {
        progress = 95;
        clearInterval(progressIntervalRef.current);
      }
      
      updateMergeState({ progress: Math.min(progress, 95) });
    }, 300);
  }, [updateMergeState]);

  // Main merge handler
  const handleMerge = useCallback(async () => {
    const { files } = mergeState;
    
    if (!validation.isValid) {
      updateMergeState({
        error: validation.errors[0],
        result: null
      });
      return;
    }

    // Create abort controller
    abortControllerRef.current = new AbortController();
    
    updateMergeState({
      isProcessing: true,
      processedFile: null,
      error: null,
      result: null,
      progress: 0,
      warnings: validation.warnings,
      currentOperation: 'Starting merge process...'
    });

    simulateProgress(files.length);

    try {
      // Enhanced merge settings
      const enhancedSettings = {
        ...mergeSettings,
        signal: abortControllerRef.current.signal,
        fileNames: files.map(f => f.name),
        totalFiles: files.length
      };

      const blob = await PDFService.mergePDFs(files, enhancedSettings);
      
      if (!blob || blob.size === 0) {
        throw new Error('Merge resulted in empty PDF file');
      }

      const outputFileName = sanitizeFileName(mergeSettings.outputFileName) || 'merged_document';
      
      const processedFile = {
        data: blob,
        fileName: outputFileName,
        originalCount: files.length,
        originalSize: files.reduce((sum, file) => sum + file.size, 0),
        mergedSize: blob.size,
        settings: mergeSettings,
        createdAt: new Date().toISOString()
      };

      updateMergeState({
        processedFile,
        result: `Successfully merged ${files.length} PDF files into a single document!`,
        progress: 100,
        currentOperation: 'Merge completed successfully!'
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        updateMergeState({
          error: 'Merge operation was cancelled by user',
          result: null,
          currentOperation: null
        });
      } else {
        console.error('PDF Merge Error:', error);
        updateMergeState({
          error: `Merge failed: ${getErrorMessage(error)}`,
          result: null,
          currentOperation: null
        });
      }
    } finally {
      updateMergeState({ isProcessing: false });
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [mergeState, mergeSettings, validation, simulateProgress]);

  // Cancel merge
  const handleCancelMerge = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    updateMergeState({
      isProcessing: false,
      progress: 0,
      error: 'Merge operation cancelled by user',
      currentOperation: null
    });
  }, [updateMergeState]);

  // Reset everything
  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    resetMergeState();
  }, [resetMergeState]);

  const {
    files,
    isProcessing,
    result,
    processedFile,
    error,
    progress,
    warnings,
    currentOperation
  } = mergeState;

  return (
    <MergePdfErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Merger
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Combine multiple PDF files into a single document with customizable settings 
            and preserved formatting. Drag and drop to reorder files.
          </p>
        </header>

        {/* File Upload Section */}
        <section aria-labelledby="upload-section">
          <h2 id="upload-section" className="sr-only">File Upload</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptedTypes=".pdf"
              multiple={true}
              maxFiles={MAX_FILES}
              maxFileSize={MAX_FILE_SIZE}
              title="Upload PDF Files to Merge"
              description={`Select multiple PDF files to combine (2-${MAX_FILES} files, max ${MAX_FILE_SIZE / (1024 * 1024)}MB each)`}
              disabled={isProcessing}
            />
          </div>
        </section>

        {/* File List Management */}
        <FileListManager
          files={files}
          onFilesChange={handleFilesChange}
          disabled={isProcessing}
        />

        {/* Merge Settings */}
        {files.length >= 2 && (
          <section aria-labelledby="settings-section">
            <h2 id="settings-section" className="sr-only">Merge Settings</h2>
            <MergeSettings
              settings={mergeSettings}
              onSettingsChange={setMergeSettings}
              disabled={isProcessing}
            />
          </section>
        )}

        {/* Progress Indicator */}
        <MergeProgress 
          progress={progress} 
          isVisible={isProcessing}
          currentOperation={currentOperation}
          fileCount={files.length}
        />

        {/* Action Buttons */}
        <section aria-labelledby="actions-section" className="text-center mb-6">
          <h2 id="actions-section" className="sr-only">Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleMerge}
              disabled={!validation.isValid || isProcessing}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              aria-describedby="merge-help"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Merging PDFs...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Merge {files.length} PDFs
                </>
              )}
            </button>

            {isProcessing && (
              <button
                onClick={handleCancelMerge}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel Merge
              </button>
            )}

            {(result || error || processedFile) && !isProcessing && (
              <button
                onClick={handleReset}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Merge More Files
              </button>
            )}

            {processedFile && !isProcessing && (
              <DownloadPdfButton
                downloadData={processedFile.data}
                fileName={processedFile.fileName}
                isProcessing={isProcessing}
                variant="success"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Merged PDF
              </DownloadPdfButton>
            )}
          </div>
          
          <p id="merge-help" className="text-sm text-gray-500 mt-3">
            {!validation.isValid 
              ? `Please fix: ${validation.errors[0]}`
              : files.length === 0
                ? 'Upload PDF files to begin merging'
                : files.length === 1
                  ? 'Add at least one more PDF file to merge'
                  : `Ready to merge ${validation.validFileCount} valid PDF files`
            }
          </p>
        </section>

        {/* Results */}
        <MergeResults
          result={result}
          error={error}
          processedFile={processedFile}
          warnings={warnings}
        />

        {/* Tips and Instructions */}
        <section aria-labelledby="tips-section" className="mt-12">
          <h2 id="tips-section" className="text-xl font-semibold text-gray-900 mb-6">
            How to Use PDF Merger
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                </svg>
                Smart Ordering
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Drag and drop files to reorder</li>
                <li>• Use arrow buttons for precise positioning</li>
                <li>• Visual numbering shows merge order</li>
                <li>• Invalid files are automatically highlighted</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Preservation Options
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Preserve original bookmarks</li>
                <li>• Maintain document metadata</li>
                <li>• Keep formatting and fonts</li>
                <li>• Generate table of contents</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Batch Processing
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Merge up to {MAX_FILES} files at once</li>
                <li>• Real-time validation and error checking</li>
                <li>• Progress tracking with status updates</li>
                <li>• Automatic file size optimization</li>
              </ul>
            </div>
          </div>
        </section>

        {/* File Limitations Info */}
        <section aria-labelledby="limits-section" className="mt-8">
          <h2 id="limits-section" className="text-lg font-semibold text-gray-900 mb-4">
            File Limitations
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium text-gray-900">Maximum Files</p>
                <p className="text-gray-600">{MAX_FILES} PDFs</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Max File Size</p>
                <p className="text-gray-600">{MAX_FILE_SIZE / (1024 * 1024)}MB per file</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">Total Size Limit</p>
                <p className="text-gray-600">{MAX_TOTAL_SIZE / (1024 * 1024)}MB combined</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MergePdfErrorBoundary>
  );
};

export default MergePdf;