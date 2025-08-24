import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiHash } from 'react-icons/fi';

const AddPageNumbers = () => {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState('bottom-center');
  const [startPage, setStartPage] = useState(1);
  const [format, setFormat] = useState('number');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0]);
  };

  const handleAddPageNumbers = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('Page numbers added successfully!');
    } catch (error) {
      console.error('Error adding page numbers:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Add Page Numbers</h1>
          <p className="text-gray-600">Add page numbers to your PDF document</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to add page numbers"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="number">1, 2, 3...</option>
                <option value="roman">i, ii, iii...</option>
                <option value="roman-upper">I, II, III...</option>
                <option value="letter">a, b, c...</option>
                <option value="letter-upper">A, B, C...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Page Number
              </label>
              <input
                type="number"
                value={startPage}
                onChange={(e) => setStartPage(parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleAddPageNumbers}
            disabled={!file || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <FiHash className="mr-2" />
            {isProcessing ? 'Adding Page Numbers...' : 'Add Page Numbers'}
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

export default AddPageNumbers;