import React, { useState, useCallback } from 'react';
import FileUpload from './FileUpload';
// ConvertPdf.jsx - Continuation from where it was cut off
const ConvertPdf = ({ 
  title = "Convert PDF", 
  description = "Convert your PDF files", 
  fromFormat = ".pdf", 
  toFormat = "Word",
  acceptedTypes = ".pdf"
}) => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert(`Please select a ${fromFormat} file to convert`);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(`File converted to ${toFormat} successfully!`);
    } catch (error) {
      console.error('Error converting file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes={acceptedTypes}
            multiple={false}
            maxFiles={1}
            title={`Upload ${fromFormat.toUpperCase()} File`}
            description={`Select a ${fromFormat} file to convert to ${toFormat}`}
          />
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : `Convert to ${toFormat}`}
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
export default ConvertPdf;