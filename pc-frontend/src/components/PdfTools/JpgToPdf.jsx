import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiImage } from 'react-icons/fi';

const JpgToPdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvertToPdf = async () => {
    if (files.length === 0) {
      alert('Please select JPG images');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`Successfully converted ${files.length} JPG image(s) to PDF!`);
    } catch (error) {
      console.error('Error converting JPG to PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">JPG to PDF Converter</h1>
          <p className="text-gray-600">Convert your JPG images into a single PDF document</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            acceptedTypes=".jpg,.jpeg"
            multiple={true}
            maxFiles={20}
            title="Upload JPG Images"
            description="Select one or more JPG images to convert to PDF"
          />
        </div>

        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Images ({files.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-2">
                  <div className="text-sm text-gray-600 truncate">{file.name}</div>
                  <div className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <button
            onClick={handleConvertToPdf}
            disabled={files.length === 0 || isProcessing}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <FiImage className="mr-2" />
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

export default JpgToPdf;