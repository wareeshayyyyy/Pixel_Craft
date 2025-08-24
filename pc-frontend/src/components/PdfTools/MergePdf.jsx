import React, { useState } from 'react';
import PdfToolLayout from '../../components/PdfTools/PdfToolLayout';
import FileUpload from '../../components/PdfTools/FileUpload';
import { FiGitMerge } from 'react-icons/fi';

 // MergePdf.jsx - Fixed version
const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDFs merged successfully!');
    } catch (error) {
      console.error('Error merging PDFs:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Merge PDF</h1>
          <p className="text-gray-600">Combine multiple PDF files into a single document</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={true}
            maxFiles={10}
            title="Upload PDF Files to Merge"
            description="Select multiple PDF files to combine into one"
          />
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Merging...' : 'Merge PDFs'}
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
export default MergePdf;




