import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiTrash2 } from 'react-icons/fi';

const RemovePages = () => {
  const [file, setFile] = useState(null);
  const [pagesToRemove, setPagesToRemove] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0]);
  };

  const handleRemovePages = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    if (!pagesToRemove.trim()) {
      alert('Please specify pages to remove');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`Pages ${pagesToRemove} removed successfully!`);
    } catch (error) {
      console.error('Error removing pages:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Remove Pages</h1>
          <p className="text-gray-600">Remove specific pages from your PDF document</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to remove pages from"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pages to Remove
            </label>
            <input
              type="text"
              value={pagesToRemove}
              onChange={(e) => setPagesToRemove(e.target.value)}
              placeholder="e.g., 1,3,5-8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter page numbers separated by commas (e.g., 1,3,5) or ranges (e.g., 5-8)
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleRemovePages}
            disabled={!file || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <FiTrash2 className="mr-2" />
            {isProcessing ? 'Removing Pages...' : 'Remove Pages'}
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

export default RemovePages;