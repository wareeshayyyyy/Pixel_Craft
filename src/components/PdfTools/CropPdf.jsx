import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiCrop } from 'react-icons/fi';

const CropPdf = () => {
  const [file, setFile] = useState(null);
  const [cropMode, setCropMode] = useState('manual');
  const [margins, setMargins] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0]);
  };

  const handleMarginChange = (side, value) => {
    setMargins(prev => ({
      ...prev,
      [side]: parseFloat(value) || 0
    }));
  };

  const handleCrop = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDF cropped successfully!');
    } catch (error) {
      console.error('Error cropping PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Crop PDF</h1>
          <p className="text-gray-600">Crop and trim pages in your PDF document</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to crop"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Mode
            </label>
            <select
              value={cropMode}
              onChange={(e) => setCropMode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="manual">Manual (Set margins)</option>
              <option value="auto">Auto (Remove white borders)</option>
              <option value="square">Square crop</option>
            </select>
          </div>

          {cropMode === 'manual' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top (mm)
                </label>
                <input
                  type="number"
                  value={margins.top}
                  onChange={(e) => handleMarginChange('top', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Right (mm)
                </label>
                <input
                  type="number"
                  value={margins.right}
                  onChange={(e) => handleMarginChange('right', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bottom (mm)
                </label>
                <input
                  type="number"
                  value={margins.bottom}
                  onChange={(e) => handleMarginChange('bottom', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Left (mm)
                </label>
                <input
                  type="number"
                  value={margins.left}
                  onChange={(e) => handleMarginChange('left', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleCrop}
            disabled={!file || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <FiCrop className="mr-2" />
            {isProcessing ? 'Cropping...' : 'Crop PDF'}
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

export default CropPdf;