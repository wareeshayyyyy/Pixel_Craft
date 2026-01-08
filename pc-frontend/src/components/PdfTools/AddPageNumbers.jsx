import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiHash } from 'react-icons/fi';
import { DownloadPdfButton } from './DownloadButton';
import PDFService from '../../services/pdfService';

const AddPageNumbers = () => {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState('bottom-center');
  const [startPage, setStartPage] = useState(1);
  const [format, setFormat] = useState('number');
  const [fontSize, setFontSize] = useState(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0]);
  };

  const handleAddPageNumbers = async () => {
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setProcessedFile(null);
    try {
      const numberingSettings = {
        position,
        startPage,
        format,
        fontSize
      };
      
      const blob = await PDFService.addPageNumbers(file, numberingSettings);
      setProcessedFile({
        data: blob,
        fileName: file.name.replace('.pdf', '_numbered')
      });
      setResult('Page numbers added successfully!');
    } catch (error) {
      console.error('Error adding page numbers:', error);
      setResult('Failed to add page numbers: ' + error.message);
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="8"
                max="24"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleAddPageNumbers}
            disabled={!file || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto mr-4"
          >
            <FiHash className="mr-2" />
            {isProcessing ? 'Adding Page Numbers...' : 'Add Page Numbers'}
          </button>
          
          {processedFile && (
            <DownloadPdfButton
              downloadData={processedFile.data}
              fileName={processedFile.fileName}
              isProcessing={isProcessing}
              variant="success"
            />
          )}
        </div>

        {result && (
          <div className={`border rounded-lg p-4 ${result.includes('Failed') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <p className={result.includes('Failed') ? 'text-red-800' : 'text-green-800'}>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPageNumbers;