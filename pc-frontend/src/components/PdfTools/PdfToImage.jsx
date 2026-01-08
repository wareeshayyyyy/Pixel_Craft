import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DownloadPdfButton from './DownloadButton';
import PDFService from '../../services/pdfService';
import { getErrorMessage } from '../../utils/errorUtils';

const PdfToImage = () => {
  const [file, setFile] = useState(null);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'jpg',
    quality: 'high',
    dpi: 300
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFiles, setProcessedFiles] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file to convert');
      return;
    }

    setIsProcessing(true);
    setProcessedFiles(null);
    setError(null);
    setResult(null);
    
    try {
      const blob = await PDFService.convertToImages(file, conversionSettings.format, conversionSettings.dpi);
      
      if (!blob || blob.size === 0) {
        throw new Error('Image conversion resulted in empty file');
      }

      const outputFileName = file.name.replace('.pdf', `_images.${conversionSettings.format}`);
      
      setProcessedFiles([{
        data: blob,
        fileName: outputFileName,
        originalName: file.name,
        format: conversionSettings.format,
        settings: conversionSettings,
        createdAt: new Date().toISOString()
      }]);
      
      setResult('PDF converted to images successfully!');
    } catch (error) {
      console.error('Error converting PDF:', error);
      setError(`Failed to convert PDF: ${getErrorMessage(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Image</h1>
          <p className="text-gray-600">Convert PDF pages to image files</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to convert to images"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                value={conversionSettings.format}
                onChange={(e) => setConversionSettings(prev => ({ ...prev, format: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="jpg">JPEG</option>
                <option value="png">PNG</option>
                <option value="tiff">TIFF</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality
              </label>
              <select
                value={conversionSettings.quality}
                onChange={(e) => setConversionSettings(prev => ({ ...prev, quality: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DPI
              </label>
              <input
                type="number"
                value={conversionSettings.dpi}
                onChange={(e) => setConversionSettings(prev => ({ ...prev, dpi: parseInt(e.target.value) || 300 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="72"
                max="600"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleConvert}
            disabled={!file || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : 'Convert to Images'}
          </button>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{result}</p>
            {processedFiles && processedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Download Converted Images:</h4>
                <div className="space-y-2">
                  {processedFiles.map((file, index) => (
                    <DownloadPdfButton 
                      key={index}
                      file={file}
                      text={`Download Image ${index + 1}`}
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

export default PdfToImage;
