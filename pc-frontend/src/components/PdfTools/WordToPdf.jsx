import React, { useState } from 'react';
import FileUpload from './FileUpload';
import { FiFileText } from 'react-icons/fi';
import DownloadPdfButton from './DownloadButton';

const WordToPdf = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFiles, setProcessedFiles] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvertToPdf = async () => {
    if (files.length === 0) {
      alert('Please select Word documents');
      return;
    }

    setIsProcessing(true);
    setProcessedFiles(null);
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file);
      });

      const base = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${base}/api/convert/word-to-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.status}`);
      }

      const data = await response.json();
      const pdfFiles = await Promise.all(
        data.fileUrls.map(async url => {
          const fileResponse = await fetch(url);
          return fileResponse.blob();
        })
      );
      
      setProcessedFiles(pdfFiles);
      setResult(`Successfully converted ${files.length} Word document(s) to PDF!`);
    } catch (error) {
      console.error('Error converting Word to PDF:', error);
      setResult('Failed to convert Word to PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Word to PDF Converter</h1>
          <p className="text-gray-600">Convert your Word documents to PDF format</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            acceptedTypes=".doc,.docx"
            multiple={true}
            maxFiles={10}
            title="Upload Word Documents"
            description="Select Word documents (.doc or .docx) to convert to PDF"
          />
        </div>

        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Documents ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FiFileText className="text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {file.name.endsWith('.docx') ? 'DOCX' : 'DOC'}
                  </div>
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
            <FiFileText className="mr-2" />
            {isProcessing ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{result}</p>
            {processedFiles && processedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Download Converted PDFs:</h4>
                <div className="space-y-2">
                  {processedFiles.map((file, index) => (
                    <DownloadPdfButton 
                      key={index} 
                      file={file} 
                      text={`Download PDF ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordToPdf;