import { useState } from 'react';
import FileUpload from "./FileUpload";
import DownloadPdfButton from './DownloadButton';
import PDFService from '../../services/pdfService';
import { getErrorMessage } from '../../utils/errorUtils';

const EditPdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleEdit = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file to edit');
      return;
    }

    setIsProcessing(true);
    setProcessedFile(null);
    setError(null);
    setResult(null);
    
    try {
      // For now, we'll use a basic repair operation as "edit"
      // In a real implementation, this would include text editing, image editing, etc.
      const blob = await PDFService.repairPDF(files[0]);
      
      if (!blob || blob.size === 0) {
        throw new Error('Edit operation resulted in empty file');
      }

      const outputFileName = files[0].name.replace('.pdf', '_edited');
      
      setProcessedFile({
        data: blob,
        fileName: outputFileName,
        originalName: files[0].name,
        createdAt: new Date().toISOString()
      });
      
      setResult('PDF edited successfully!');
    } catch (error) {
      console.error('Error editing PDF:', error);
      setError(`Failed to edit PDF: ${getErrorMessage(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit PDF</h1>
          <p className="text-gray-600">Edit text, images and content in PDF files</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File to Edit"
            description="Select a PDF file to edit its content"
          />
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleEdit}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Editing...' : 'Edit PDF'}
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
                  <h4 className="font-medium text-red-800 mb-1">Edit Failed</h4>
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
                  <h4 className="font-medium text-green-800 mb-1">Edit Successful</h4>
                  <p className="text-sm text-green-700 mb-3">{result}</p>
                  
                  {processedFile && (
                    <div className="bg-white rounded p-4 border border-green-200">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {processedFile.fileName}.pdf
                          </p>
                          <p className="text-xs text-gray-600">
                            Size: {(processedFile.data.size / (1024 * 1024)).toFixed(2)} MB • 
                            Created: {new Date(processedFile.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          EDITED PDF
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
                        Download Edited PDF
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

export default EditPdf;