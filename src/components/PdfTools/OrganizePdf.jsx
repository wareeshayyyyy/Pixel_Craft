import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiMove } from 'react-icons/fi';

const OrganizePdf = () => {
  const [file, setFile] = useState(null);
  const [pageOrder, setPageOrder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0]);
  };

  const handleOrganize = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    if (!pageOrder.trim()) {
      alert('Please specify the new page order');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`PDF pages organized successfully!`);
    } catch (error) {
      console.error('Error organizing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Organize PDF</h1>
          <p className="text-gray-600">Reorder and organize pages in your PDF document</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to organize"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Page Order
            </label>
            <input
              type="text"
              value={pageOrder}
              onChange={(e) => setPageOrder(e.target.value)}
              placeholder="e.g., 3,1,2,4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the desired page order separated by commas (e.g., 3,1,2,4 to move page 3 to first position)
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleOrganize}
            disabled={!file || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <FiMove className="mr-2" />
            {isProcessing ? 'Organizing...' : 'Organize PDF'}
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

export default OrganizePdf;