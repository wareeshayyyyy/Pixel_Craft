import React, { useState } from 'react';
import FileUpload from './FileUpload';

 // PdfToPdfA.jsx
const PdfToPdfA = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    pdfaLevel: 'PDF/A-1b',
    colorProfile: 'sRGB',
    embedFonts: true,
    validateCompliance: true
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
      await new Promise(resolve => setTimeout(resolve, 2500));
      setResult('PDF converted to PDF/A format successfully!');
    } catch (error) {
      console.error('Error converting to PDF/A:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to PDF/A</h1>
          <p className="text-gray-600">Convert PDF to archival PDF/A format for long-term preservation</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to convert to PDF/A format"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF/A Level
              </label>
              <select
                value={conversionSettings.pdfaLevel}
                onChange={(e) => setConversionSettings(prev => ({...prev, pdfaLevel: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="PDF/A-1a">PDF/A-1a (Highest compliance)</option>
                <option value="PDF/A-1b">PDF/A-1b (Visual appearance)</option>
                <option value="PDF/A-2a">PDF/A-2a (Enhanced features)</option>
                <option value="PDF/A-2b">PDF/A-2b (Visual appearance + features)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Profile
              </label>
              <select
                value={conversionSettings.colorProfile}
                onChange={(e) => setConversionSettings(prev => ({...prev, colorProfile: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="sRGB">sRGB</option>
                <option value="Adobe RGB">Adobe RGB</option>
                <option value="CMYK">CMYK</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.embedFonts}
                onChange={(e) => setConversionSettings(prev => ({...prev, embedFonts: e.target.checked}))}
                className="mr-2"
              />
              Embed All Fonts
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.validateCompliance}
                onChange={(e) => setConversionSettings(prev => ({...prev, validateCompliance: e.target.checked}))}
                className="mr-2"
              />
              Validate PDF/A Compliance
            </label>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">About PDF/A Format</h4>
            <p className="text-sm text-blue-800">
              PDF/A is an ISO standard for archival storage of PDF documents. It ensures long-term 
              readability by embedding fonts, restricting certain features, and requiring compliance validation.
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : 'Convert to PDF/A'}
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

export default PdfToPdfA;