import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiCamera } from 'react-icons/fi';

const ScanToPdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [quality, setQuality] = useState('medium');

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleScanToPdf = async () => {
    if (files.length === 0) {
      alert('Please select image files to convert');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`${files.length} scanned images converted to PDF successfully!`);
    } catch (error) {
      console.error('Error converting scans to PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Scan to PDF</h1>
          <p className="text-gray-600">Convert scanned images and documents to PDF format</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".jpg,.jpeg,.png,.tiff,.bmp"
            multiple={true}
            maxFiles={20}
            title="Upload Scanned Images"
            description="Select scanned images to convert to PDF"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Quality
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="low">Low (Smaller file size)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Better quality)</option>
            </select>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleScanToPdf}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <FiCamera className="mr-2" />
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

export default ScanToPdf;