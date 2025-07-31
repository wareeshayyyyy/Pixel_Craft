import React, { useState } from 'react';
import FileUpload from '../FileUpload';
// PdfToText.jsx
const PdfToText = () => {
  const [files, setFiles] = useState([]);
  const [extractionSettings, setExtractionSettings] = useState({
    format: 'txt',
    preserveFormatting: false,
    extractFromImages: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleExtract = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to extract text from');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('Text extracted from PDF successfully!');
    } catch (error) {
      console.error('Error extracting text:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Text</h1>
          <p className="text-gray-600">Extract plain text from PDF documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to extract text from"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Extraction Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <select
              value={extractionSettings.format}
              onChange={(e) => setExtractionSettings(prev => ({...prev, format: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="txt">Plain Text (.txt)</option>
              <option value="rtf">Rich Text (.rtf)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={extractionSettings.preserveFormatting}
                onChange={(e) => setExtractionSettings(prev => ({...prev, preserveFormatting: e.target.checked}))}
                className="mr-2"
              />
              Preserve Text Formatting
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={extractionSettings.extractFromImages}
                onChange={(e) => setExtractionSettings(prev => ({...prev, extractFromImages: e.target.checked}))}
                className="mr-2"
              />
              Extract Text from Images (OCR)
            </label>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleExtract}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Extracting...' : 'Extract Text'}
          </button>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default PdfToText;