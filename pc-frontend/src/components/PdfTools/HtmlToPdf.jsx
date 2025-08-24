import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiCode } from 'react-icons/fi';

const HtmlToPdf = () => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [conversionType, setConversionType] = useState('file'); // 'file' or 'url'
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvertToPdf = async () => {
    if (conversionType === 'file' && files.length === 0) {
      alert('Please select HTML files');
      return;
    }

    if (conversionType === 'url' && !url.trim()) {
      alert('Please enter a URL');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (conversionType === 'file') {
        setResult(`Successfully converted ${files.length} HTML file(s) to PDF!`);
      } else {
        setResult(`Successfully converted webpage from URL to PDF!`);
      }
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">HTML to PDF Converter</h1>
          <p className="text-gray-600">Convert HTML files or web pages to PDF format</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">Conversion Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={conversionType === 'file'}
                  onChange={(e) => setConversionType(e.target.value)}
                  className="mr-2"
                />
                HTML Files
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={conversionType === 'url'}
                  onChange={(e) => setConversionType(e.target.value)}
                  className="mr-2"
                />
                Web URL
              </label>
            </div>
          </div>

          {conversionType === 'file' ? (
            <FileUpload
              onFilesSelected={handleFileSelected}
              acceptedTypes=".html,.htm"
              multiple={true}
              maxFiles={10}
              title="Upload HTML Files"
              description="Select HTML files (.html or .htm) to convert to PDF"
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the complete URL of the webpage you want to convert
              </p>
            </div>
          )}
        </div>

        {conversionType === 'file' && files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected HTML Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FiCode className="text-green-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">HTML</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <button
            onClick={handleConvertToPdf}
            disabled={(conversionType === 'file' && files.length === 0) || (conversionType === 'url' && !url.trim()) || isProcessing}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <FiCode className="mr-2" />
            {isProcessing ? 'Converting...' : 'Convert to PDF'}
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

export default HtmlToPdf;