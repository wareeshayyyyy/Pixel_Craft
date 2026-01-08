import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DownloadPdfButton from './DownloadButton';
import PDFService from '../../services/pdfService';
import { getErrorMessage } from '../../utils/errorUtils';
import { FiCamera } from 'react-icons/fi';

const ScanToPdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState('medium');

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleScanToPdf = async () => {
    if (files.length === 0) {
      setError('Please select image files to convert');
      return;
    }

    setIsProcessing(true);
    setProcessedFile(null);
    setError(null);
    setResult(null);

    try {
      const scanSettings = {
        quality: quality,
        orientation: 'auto',
        paperSize: 'A4'
      };

      const blob = await PDFService.scanToPDF(files, scanSettings);
      
      if (!blob || blob.size === 0) {
        throw new Error('Scan to PDF conversion resulted in empty file');
      }

      const outputFileName = `scanned_document_${new Date().getTime()}.pdf`;
      
      setProcessedFile({
        data: blob,
        fileName: outputFileName,
        imageCount: files.length,
        quality: quality,
        createdAt: new Date().toISOString()
      });

      setResult(`${files.length} scanned images converted to PDF successfully!`);
    } catch (error) {
      console.error('Error converting scans to PDF:', error);
      setError(`Failed to convert scans to PDF: ${getErrorMessage(error)}`);
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

        {/* Results Section */}
        {(result || error) && (
          <div className={`border rounded-lg p-4 mb-6 ${
            error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            {error && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-red-800 mb-1">Conversion Failed</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {result && !error && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="font-medium text-green-800 mb-1">Conversion Successful</h4>
                  <p className="text-sm text-green-700 mb-3">{result}</p>
                  
                  {processedFile && (
                    <div className="bg-white rounded p-4 border border-green-200">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {processedFile.fileName}
                          </p>
                          <p className="text-xs text-gray-600">
                            Size: {(processedFile.data.size / (1024 * 1024)).toFixed(2)} MB • 
                            Images: {processedFile.imageCount} • 
                            Quality: {processedFile.quality}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(processedFile.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          SCANNED PDF
                        </span>
                      </div>
                      
                      <DownloadPdfButton
                        downloadData={processedFile.data}
                        fileName={processedFile.fileName}
                        isProcessing={isProcessing}
                        variant="success"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Scanned PDF
                      </DownloadPdfButton>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanToPdf;