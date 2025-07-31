import React, { useState } from 'react';
import FileUpload from '../FileUpload';

// PdfToPowerPoint.jsx
const PdfToPpt = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'pptx',
    slidePerPage: true,
    preserveImages: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to convert');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResult('PDF converted to PowerPoint successfully!');
    } catch (error) {
      console.error('Error converting PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to PowerPoint</h1>
          <p className="text-gray-600">Convert PDF to PowerPoint presentations</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to convert to PowerPoint"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <select
              value={conversionSettings.format}
              onChange={(e) => setConversionSettings(prev => ({...prev, format: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pptx">PowerPoint (.pptx)</option>
              <option value="ppt">PowerPoint 97-2003 (.ppt)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.slidePerPage}
                onChange={(e) => setConversionSettings(prev => ({...prev, slidePerPage: e.target.checked}))}
                className="mr-2"
              />
              One Slide per PDF Page
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.preserveImages}
                onChange={(e) => setConversionSettings(prev => ({...prev, preserveImages: e.target.checked}))}
                className="mr-2"
              />
              Preserve Images and Graphics
            </label>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : 'Convert to PowerPoint'}
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

export default PdfToPpt;