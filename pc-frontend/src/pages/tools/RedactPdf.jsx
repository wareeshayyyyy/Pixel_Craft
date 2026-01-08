import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Shield, AlertTriangle, CheckCircle, Loader, Eye, EyeOff, FileText } from 'lucide-react';

const RedactPdf = () => {
  const [files, setFiles] = useState([]);
  const [redactionType, setRedactionType] = useState('text');
  const [sensitivityLevel, setSensitivityLevel] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [redactedFiles, setRedactedFiles] = useState([]);
  const [permanentRemoval, setPermanentRemoval] = useState(false);
  const [searchTerms, setSearchTerms] = useState('');
  const [customPatterns, setCustomPatterns] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = useCallback((selectedFiles) => {
    if (!selectedFiles) return;
    
    const pdfFiles = Array.from(selectedFiles).filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (pdfFiles.length === 0) {
      setError('Please select valid PDF files only');
      return;
    }
    
    setFiles(pdfFiles);
    setRedactedFiles([]);
    setError('');
    setSuccess('');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Predefined patterns for different redaction types
  const getRedactionPatterns = () => {
    const patterns = {
      text: [
        { name: 'Social Security Numbers', pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
        { name: 'Phone Numbers', pattern: /\b\d{3}-\d{3}-\d{4}\b/g },
        { name: 'Email Addresses', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g },
        { name: 'Credit Card Numbers', pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g },
        { name: 'Addresses', pattern: /\b\d+\s+[A-Za-z0-9\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s+\d{5}\b/g }
      ],
      images: ['Faces', 'Signatures', 'Logos', 'Screenshots'],
      area: ['Custom Selection', 'Headers', 'Footers', 'Margins']
    };
    return patterns[redactionType] || [];
  };

  // Add custom pattern
  const addCustomPattern = () => {
    if (!searchTerms.trim()) return;
    
    const newPattern = {
      name: `Custom: ${searchTerms}`,
      pattern: new RegExp(searchTerms.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
      isCustom: true
    };
    
    setCustomPatterns(prev => [...prev, newPattern]);
    setSearchTerms('');
  };

  // Remove custom pattern
  const removeCustomPattern = (index) => {
    setCustomPatterns(prev => prev.filter((_, i) => i !== index));
  };

  // Simulate PDF redaction process
  const simulateRedaction = async (file) => {
    // In a real implementation, this would use PDF processing libraries like PDF-lib
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Create a simulated redacted PDF
    const redactedFileName = file.name.replace(/\.pdf$/i, '_redacted.pdf');
    
    // Simulate file size reduction (redacted content is typically smaller)
    const sizeReduction = Math.random() * 0.3 + 0.1; // 10-40% reduction
    const newSize = Math.floor(file.size * (1 - sizeReduction));
    
    // Create a blob to represent the redacted PDF
    const redactedBlob = new Blob(['%PDF-1.4 (Redacted PDF Simulation)'], { type: 'application/pdf' });
    const redactedFile = new File([redactedBlob], redactedFileName, {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    
    // Override the size property for simulation
    Object.defineProperty(redactedFile, 'size', { value: newSize, writable: false });
    
    return {
      original: file,
      redacted: redactedFile,
      redactionCount: Math.floor(Math.random() * 20) + 5, // 5-25 redactions
      pagesProcessed: Math.floor(Math.random() * 10) + 1, // 1-10 pages
      sizeReduction: (sizeReduction * 100).toFixed(1),
      timestamp: new Date().toLocaleString()
    };
  };

  // Process redaction
  const redactDocuments = async () => {
    if (files.length === 0) {
      setError('Please select PDF files to redact');
      return;
    }

    if (!permanentRemoval) {
      setError('Please confirm that you want to permanently remove content');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');
    const results = [];

    try {
      for (const file of files) {
        const result = await simulateRedaction(file);
        results.push(result);
      }

      setRedactedFiles(results);
      setSuccess(`Successfully redacted ${results.length} PDF file(s)`);
    } catch (err) {
      setError('Failed to process some files. Please try again.');
      console.error('Redaction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download redacted file
  const downloadRedacted = (result) => {
    const url = URL.createObjectURL(result.redacted);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.redacted.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download all redacted files
  const downloadAll = () => {
    redactedFiles.forEach((result, index) => {
      setTimeout(() => downloadRedacted(result), index * 100);
    });
  };

  // Remove file from list
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (redactedFiles.length > 0) {
      const newRedacted = redactedFiles.filter((_, i) => i !== index);
      setRedactedFiles(newRedacted);
    }
  };

  // Clear all results
  const clearAll = () => {
    setRedactedFiles([]);
    setError('');
    setSuccess('');
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Redact PDF</h1>
          <p className="text-gray-600">
            Permanently remove sensitive content from your PDF documents. Securely black out text, images, or entire sections.
          </p>
        </div>

        {/* File Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div
            className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-16 h-16 text-red-400" />
              <h3 className="text-xl font-semibold text-gray-700">Select PDF files</h3>
              <p className="text-gray-500">or drop PDF files here</p>
              
              <input
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="pdf-input"
              />
              <label
                htmlFor="pdf-input"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Choose PDF Files
              </label>
              
              <p className="text-sm text-gray-400">Supports: PDF files only</p>
            </div>
          </div>
        </div>

        {/* Redaction Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Redaction Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Redaction Type</label>
                <select
                  value={redactionType}
                  onChange={(e) => setRedactionType(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="text">Text Content</option>
                  <option value="images">Images & Graphics</option>
                  <option value="area">Custom Areas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Sensitivity Level</label>
                <select 
                  value={sensitivityLevel}
                  onChange={(e) => setSensitivityLevel(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="standard">Standard</option>
                  <option value="high">High Security</option>
                  <option value="complete">Complete Removal</option>
                </select>
              </div>
            </div>

            {/* Pattern Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                {redactionType === 'text' ? 'Content Patterns to Redact' : 
                 redactionType === 'images' ? 'Image Types to Redact' : 
                 'Area Types to Redact'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {getRedactionPatterns().map((pattern, index) => (
                  <label key={index} className="flex items-center p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="mr-2"
                      defaultChecked={index < 2}
                    />
                    <span className="text-sm">{redactionType === 'text' ? pattern.name : pattern}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Search Terms */}
            {redactionType === 'text' && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Custom Search Terms</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={searchTerms}
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder="Enter words or phrases to redact"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomPattern()}
                  />
                  <button
                    onClick={addCustomPattern}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                
                {customPatterns.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customPatterns.map((pattern, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                        {pattern.name}
                        <button
                          onClick={() => removeCustomPattern(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Options */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Security Options</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Remove metadata and properties</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Apply multiple redaction passes</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Flatten document structure</span>
                </label>
              </div>
            </div>

            {/* Confirmation */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <label className="flex items-center font-medium text-yellow-800">
                    <input
                      type="checkbox"
                      checked={permanentRemoval}
                      onChange={(e) => setPermanentRemoval(e.target.checked)}
                      className="mr-2"
                    />
                    I understand this will permanently remove content
                  </label>
                  <p className="text-sm text-yellow-700 mt-1">
                    Redacted content cannot be recovered. This action is irreversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              <button
                onClick={redactDocuments}
                disabled={isProcessing || !permanentRemoval}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Redacting...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Redact Documents</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg relative">
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="flex items-center space-x-3 pr-6">
                    <FileText className="w-5 h-5 text-red-500" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Redacted Files Results */}
        {redactedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Redacted Documents ({redactedFiles.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPreview ? 'Hide' : 'Show'} Details</span>
                </button>
                <button
                  onClick={downloadAll}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
                <button
                  onClick={clearAll}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redactedFiles.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-sm truncate">{result.redacted.name}</span>
                    </div>
                  </div>
                  
                  {showPreview && (
                    <div className="text-xs text-gray-600 space-y-1 mb-3">
                      <div>Redactions: {result.redactionCount}</div>
                      <div>Pages processed: {result.pagesProcessed}</div>
                      <div>Size reduction: {result.sizeReduction}%</div>
                      <div>Completed: {result.timestamp}</div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-3">
                    {(result.redacted.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  
                  <button
                    onClick={() => downloadRedacted(result)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded transition-colors flex items-center justify-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Redacted PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">How to use PDF Redaction:</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>• Upload PDF files that contain sensitive information</li>
            <li>• Choose what type of content to redact (text, images, or custom areas)</li>
            <li>• Select predefined patterns or add custom search terms</li>
            <li>• Confirm permanent removal (this cannot be undone)</li>
            <li>• Download your securely redacted PDF files</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Note: This is a demo version. In production, this would use advanced PDF processing libraries 
            to ensure complete and secure redaction of sensitive content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedactPdf;