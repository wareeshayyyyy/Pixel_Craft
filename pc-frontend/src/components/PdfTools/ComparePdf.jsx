// ComparePdf.jsx - Fixed version
import React, { useState } from 'react';
import FileUpload from './FileUpload';

const ComparePdf = () => {
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState({
    compareMode: 'text',
    highlightChanges: true,
    outputFormat: 'pdf'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCompare = async () => {
    if (files.length < 2) {
      alert('Please select two PDF files to compare');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('Comparison completed successfully!');
    } catch (error) {
      console.error('Error comparing PDFs:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare PDF</h1>
          <p className="text-gray-600">Compare two PDF documents to find differences</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={true}
            maxFiles={2}
            title="Upload PDF Files to Compare"
            description="Select exactly 2 PDF files to compare"
          />
        </div>

        {/* Options Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Comparison Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare Mode
              </label>
              <select
                value={options.compareMode}
                onChange={(e) => handleOptionChange('compareMode', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">Text Only</option>
                <option value="visual">Visual</option>
                <option value="both">Text + Visual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                value={options.outputFormat}
                onChange={(e) => handleOptionChange('outputFormat', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pdf">PDF Report</option>
                <option value="html">HTML Report</option>
                <option value="json">JSON Data</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlightChanges"
                checked={options.highlightChanges}
                onChange={(e) => handleOptionChange('highlightChanges', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="highlightChanges" className="ml-2 text-sm text-gray-700">
                Highlight Changes
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleCompare}
            disabled={files.length < 2 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Comparing...' : 'Compare PDFs'}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default ComparePdf;




/* // ComparePdf.jsx
const ComparePdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleCompare = async () => {
    if (files.length < 2) {
      alert('Please select two PDF files to compare');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDF comparison completed successfully!');
    } catch (error) {
      console.error('Error comparing PDFs:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare PDF</h1>
          <p className="text-gray-600">Compare two PDF documents to find differences</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={true}
            maxFiles={2}
            title="Upload PDF Files to Compare"
            description="Select exactly two PDF files to compare"
          />
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleCompare}
            disabled={files.length < 2 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Comparing...' : 'Compare PDFs'}
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
 */