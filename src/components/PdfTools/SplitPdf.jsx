import React, { useState } from 'react';
import FileUpload from '../FileUpload';
// SplitPdf.jsx - Fixed version
const SplitPdf = () => {
  const [files, setFiles] = useState([]);
  const [splitOptions, setSplitOptions] = useState({
    method: 'pages',
    pageRange: '',
    splitEvery: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleSplit = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to split');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDF split successfully!');
    } catch (error) {
      console.error('Error splitting PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Split PDF</h1>
          <p className="text-gray-600">Split a PDF file into multiple documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File to Split"
            description="Select a PDF file to split into multiple documents"
          />
        </div>

        {/* Split Options */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Split Options</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split Method
              </label>
              <select
                value={splitOptions.method}
                onChange={(e) => setSplitOptions(prev => ({ ...prev, method: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pages">Split by Page Range</option>
                <option value="every">Split Every N Pages</option>
                <option value="size">Split by File Size</option>
              </select>
            </div>

            {splitOptions.method === 'pages' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Range (e.g., 1-5, 10-15)
                </label>
                <input
                  type="text"
                  value={splitOptions.pageRange}
                  onChange={(e) => setSplitOptions(prev => ({ ...prev, pageRange: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1-5, 10-15"
                />
              </div>
            )}

            {splitOptions.method === 'every' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Split Every N Pages
                </label>
                <input
                  type="number"
                  value={splitOptions.splitEvery}
                  onChange={(e) => setSplitOptions(prev => ({ ...prev, splitEvery: parseInt(e.target.value) || 1 }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleSplit}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Splitting...' : 'Split PDF'}
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

export default SplitPdf;