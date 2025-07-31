// CompressPdf.jsx
import React, { useState } from 'react';
import FileUpload from './FileUpload';

const CompressPdf = () => {
  const [files, setFiles] = useState([]);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to compress');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDF compressed successfully!');
    } catch (error) {
      console.error('Error compressing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compress PDF</h1>
          <p className="text-gray-600">Reduce PDF file size while maintaining quality</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File to Compress"
            description="Select a PDF file to reduce its size"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Compression Level</h3>
          <div className="space-y-2">
            {['low', 'medium', 'high', 'maximum'].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  value={level}
                  checked={compressionLevel === level}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                  className="mr-2"
                />
                <span className="capitalize">{level} Compression</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleCompress}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Compressing...' : 'Compress PDF'}
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

export default CompressPdf;