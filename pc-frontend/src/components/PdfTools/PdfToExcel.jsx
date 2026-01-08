import React from 'react';
import { useState, useCallback, useRef } from 'react';
import FileUpload from './FileUpload';
import { DownloadExcelButton } from "./DownloadButton";

const PdfToExcel = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'xlsx',
    detectTables: true,
    multipleSheets: false,
    ocrEnabled: true,
    preserveFormatting: true,
    extractImages: false,
    pageRange: { start: '', end: '', all: true },
    tableDetectionSensitivity: 'medium',
    mergeSmallTables: true,
    removeEmptyRows: true,
    customDelimiter: ',',
    dateFormat: 'auto'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [result, setResult] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [errorDetails, setErrorDetails] = useState(null);
  const abortControllerRef = useRef(null);

  const handleFilesSelected = useCallback((selectedFiles) => {
    setFiles(selectedFiles);
    setProcessedFile(null);
    setResult(null);
    setPreviewData(null);
    setErrorDetails(null);
    setProcessingProgress(0);
  }, []);

  const validatePdfFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const validTypes = ['application/pdf'];
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please select a PDF file.');
    }
    
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 100MB.');
    }
    
    return true;
  };

  const simulateProcessingStages = () => {
    const stages = [
      { stage: 'Analyzing PDF structure...', progress: 10 },
      { stage: 'Detecting tables...', progress: 25 },
      { stage: 'Extracting table data...', progress: 45 },
      { stage: 'Processing OCR (if needed)...', progress: 65 },
      { stage: 'Formatting Excel data...', progress: 80 },
      { stage: 'Generating Excel file...', progress: 95 },
      { stage: 'Finalizing conversion...', progress: 100 }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProcessingStage(stages[currentStage].stage);
        setProcessingProgress(stages[currentStage].progress);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return interval;
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setResult('Please select a PDF file to convert');
      return;
    }

    try {
      validatePdfFile(files[0]);
    } catch (error) {
      setResult(error.message);
      return;
    }

    setIsProcessing(true);
    setProcessedFile(null);
    setResult(null);
    setErrorDetails(null);
    setProcessingProgress(0);
    
    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();
    
    const progressInterval = simulateProcessingStages();

    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('settings', JSON.stringify(conversionSettings));

      const base = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${base}/api/pdf/to-excel`, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
        headers: {
          'X-Conversion-Type': 'pdf-to-excel',
          'X-Client-Version': '2.0'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Conversion failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const fileName = files[0].name.replace(/\.pdf$/i, '');
      
      setProcessedFile({
        data: blob,
        fileName,
        format: conversionSettings.format,
        originalSize: files[0].size,
        convertedSize: blob.size,
        timestamp: new Date().toISOString()
      });

      // Add to conversion history
      const historyEntry = {
        id: Date.now(),
        originalFile: files[0].name,
        convertedFile: `${fileName}.${conversionSettings.format}`,
        timestamp: new Date().toLocaleString(),
        settings: { ...conversionSettings }
      };
      setConversionHistory(prev => [historyEntry, ...prev.slice(0, 4)]);

      setResult('PDF converted to Excel successfully!');
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessingStage('Conversion completed');

    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error converting PDF:', error);
      
      if (error.name === 'AbortError') {
        setResult('Conversion cancelled by user');
      } else {
        setResult('Conversion failed');
        setErrorDetails({
          message: error.message,
          timestamp: new Date().toLocaleString(),
          fileInfo: {
            name: files[0]?.name,
            size: files[0]?.size,
            type: files[0]?.type
          }
        });
      }
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingStage('');
    }
  };

  const handleCancelConversion = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handlePreview = async () => {
    if (files.length === 0) return;
    
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('preview', 'true');
      
      const base = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${base}/api/pdf/preview-tables`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const previewData = await response.json();
        setPreviewData(previewData);
      }
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  const resetSettings = () => {
    setConversionSettings({
      format: 'xlsx',
      detectTables: true,
      multipleSheets: false,
      ocrEnabled: true,
      preserveFormatting: true,
      extractImages: false,
      pageRange: { start: '', end: '', all: true },
      tableDetectionSensitivity: 'medium',
      mergeSmallTables: true,
      removeEmptyRows: true,
      customDelimiter: ',',
      dateFormat: 'auto'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">PDF to Excel</h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Extract tables from PDF and convert them to Excel spreadsheets
          </p>
          <p className="text-sm text-gray-500">
            Supports complex tables, OCR for scanned documents, and preserves formatting
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Drag and drop your PDF file here or click to browse (max 100MB)"
          />
          
          {files.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{files[0].name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {(files[0].size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handlePreview}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Preview Tables
                </button>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Remove File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {previewData && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Table Preview
            </h3>
            <div className="text-sm text-gray-600 mb-3">
              Found {previewData.tableCount} table(s) in {previewData.pageCount} page(s)
            </div>
            <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-auto">
              <pre className="text-xs">{JSON.stringify(previewData.sample, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Conversion Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Conversion Settings
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showAdvanced ? 'Basic Settings' : 'Advanced Settings'}
              </button>
              <button
                onClick={resetSettings}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select
                  value={conversionSettings.format}
                  onChange={(e) => setConversionSettings(prev => ({...prev, format: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="xlsx">Excel (.xlsx) - Recommended</option>
                  <option value="xls">Excel 97-2003 (.xls)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="ods">OpenDocument (.ods)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.detectTables}
                    onChange={(e) => setConversionSettings(prev => ({...prev, detectTables: e.target.checked}))}
                    className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Auto-detect Tables</div>
                    <div className="text-sm text-gray-600">Automatically identify and extract table structures</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.multipleSheets}
                    onChange={(e) => setConversionSettings(prev => ({...prev, multipleSheets: e.target.checked}))}
                    className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Multiple Sheets</div>
                    <div className="text-sm text-gray-600">Create separate sheet for each page</div>
                  </div>
                </label>

                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.ocrEnabled}
                    onChange={(e) => setConversionSettings(prev => ({...prev, ocrEnabled: e.target.checked}))}
                    className="mr-3 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">OCR Processing</div>
                    <div className="text-sm text-gray-600">Extract text from scanned documents</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Detection Sensitivity
                  </label>
                  <select
                    value={conversionSettings.tableDetectionSensitivity}
                    onChange={(e) => setConversionSettings(prev => ({...prev, tableDetectionSensitivity: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="low">Low (fewer false positives)</option>
                    <option value="medium">Medium (balanced)</option>
                    <option value="high">High (detect more tables)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Range
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={conversionSettings.pageRange.all}
                        onChange={() => setConversionSettings(prev => ({
                          ...prev, 
                          pageRange: { ...prev.pageRange, all: true }
                        }))}
                        className="mr-2"
                      />
                      All pages
                    </label>
                    <label className="flex items-center ml-4">
                      <input
                        type="radio"
                        checked={!conversionSettings.pageRange.all}
                        onChange={() => setConversionSettings(prev => ({
                          ...prev, 
                          pageRange: { ...prev.pageRange, all: false }
                        }))}
                        className="mr-2"
                      />
                      Range:
                    </label>
                    <input
                      type="number"
                      placeholder="From"
                      disabled={conversionSettings.pageRange.all}
                      value={conversionSettings.pageRange.start}
                      onChange={(e) => setConversionSettings(prev => ({
                        ...prev, 
                        pageRange: { ...prev.pageRange, start: e.target.value }
                      }))}
                      className="w-20 p-2 border border-gray-300 rounded text-sm"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="To"
                      disabled={conversionSettings.pageRange.all}
                      value={conversionSettings.pageRange.end}
                      onChange={(e) => setConversionSettings(prev => ({
                        ...prev, 
                        pageRange: { ...prev.pageRange, end: e.target.value }
                      }))}
                      className="w-20 p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionSettings.preserveFormatting}
                      onChange={(e) => setConversionSettings(prev => ({...prev, preserveFormatting: e.target.checked}))}
                      className="mr-2"
                    />
                    Preserve cell formatting
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionSettings.extractImages}
                      onChange={(e) => setConversionSettings(prev => ({...prev, extractImages: e.target.checked}))}
                      className="mr-2"
                    />
                    Extract images from tables
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionSettings.mergeSmallTables}
                      onChange={(e) => setConversionSettings(prev => ({...prev, mergeSmallTables: e.target.checked}))}
                      className="mr-2"
                    />
                    Merge small adjacent tables
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={conversionSettings.removeEmptyRows}
                      onChange={(e) => setConversionSettings(prev => ({...prev, removeEmptyRows: e.target.checked}))}
                      className="mr-2"
                    />
                    Remove empty rows and columns
                  </label>
                </div>

                {conversionSettings.format === 'csv' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSV Delimiter
                    </label>
                    <select
                      value={conversionSettings.customDelimiter}
                      onChange={(e) => setConversionSettings(prev => ({...prev, customDelimiter: e.target.value}))}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Processing Section */}
        {isProcessing && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Converting PDF to Excel</h3>
              <button
                onClick={handleCancelConversion}
                className="text-sm text-red-600 hover:text-red-700 px-3 py-1 border border-red-300 rounded-md"
              >
                Cancel
              </button>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{processingStage}</span>
                <span>{processingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Processing may take a few moments depending on file size and complexity...
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || isProcessing}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isProcessing ? 'Converting...' : 'Convert to Excel'}
            </button>

            {processedFile && !isProcessing && (
              <DownloadExcelButton
                downloadData={processedFile.data}
                fileName={processedFile.fileName}
                fileExtension={processedFile.format}
                isProcessing={isProcessing}
                variant="success"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              />
            )}
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className={`rounded-xl p-6 mb-6 border ${
            result.includes('successfully') || result.includes('completed')
              ? 'bg-green-50 border-green-200' 
              : result.includes('failed') || result.includes('error')
              ? 'bg-red-50 border-red-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 mr-3 ${
                result.includes('successfully') ? 'text-green-600' : 
                result.includes('failed') ? 'text-red-600' : 'text-blue-600'
              }`}>
                {result.includes('successfully') ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : result.includes('failed') ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  result.includes('successfully') ? 'text-green-800' : 
                  result.includes('failed') ? 'text-red-800' : 'text-blue-800'
                }`}>
                  {result}
                </p>
                
                {processedFile && (
                  <div className="mt-3 text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-4">
                      <div>Original size: {(processedFile.originalSize / 1024 / 1024).toFixed(2)} MB</div>
                      <div>Converted size: {(processedFile.convertedSize / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Details */}
        {errorDetails && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Error Details</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Error:</strong> {errorDetails.message}</div>
              <div><strong>Time:</strong> {errorDetails.timestamp}</div>
              <div><strong>File:</strong> {errorDetails.fileInfo.name}</div>
              <div><strong>Size:</strong> {(errorDetails.fileInfo.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
        )}

        {/* Conversion History */}
        {conversionHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Conversions
            </h3>
            <div className="space-y-3">
              {conversionHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{entry.originalFile} → {entry.convertedFile}</div>
                    <div className="text-xs text-gray-500">{entry.timestamp}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {entry.settings.format.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Info */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Why Choose Our PDF to Excel Converter?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">High Accuracy</div>
                  <div className="text-sm text-gray-600">Advanced table detection preserves structure and formatting</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">OCR Support</div>
                  <div className="text-sm text-gray-600">Extract tables from scanned PDFs with OCR technology</div>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Multiple Formats</div>
                  <div className="text-sm text-gray-600">Export to XLSX, XLS, CSV, or ODS formats</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Batch Processing</div>
                  <div className="text-sm text-gray-600">Process multiple tables across all pages efficiently</div>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Secure Processing</div>
                  <div className="text-sm text-gray-600">Your files are processed securely and deleted after conversion</div>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">No Software Required</div>
                  <div className="text-sm text-gray-600">Works entirely in your browser, no downloads needed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Tips for Best Results
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div>• Use high-quality PDF files for better table detection</div>
              <div>• Enable OCR for scanned documents</div>
              <div>• Check table preview before conversion</div>
            </div>
            <div className="space-y-2">
              <div>• Use page range for large documents</div>
              <div>• Choose appropriate sensitivity for complex layouts</div>
              <div>• Enable formatting preservation for styled tables</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToExcel;