import React from 'react';
import { useState } from 'react';
import FileUpload from '../FileUpload';
// PdfToExcel.jsx
const PdfToExcel = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'xlsx',
    detectTables: true,
    multipleSheets: false
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
      setResult('PDF converted to Excel successfully!');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Excel</h1>
          <p className="text-gray-600">Convert PDF tables to Excel spreadsheets</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file with tables to convert to Excel"
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
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="xls">Excel 97-2003 (.xls)</option>
              <option value="csv">CSV (.csv)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.detectTables}
                onChange={(e) => setConversionSettings(prev => ({...prev, detectTables: e.target.checked}))}
                className="mr-2"
              />
              Auto-detect Tables
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.multipleSheets}
                onChange={(e) => setConversionSettings(prev => ({...prev, multipleSheets: e.target.checked}))}
                className="mr-2"
              />
              Create Multiple Sheets (one per page)
            </label>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : 'Convert to Excel'}
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


export default PdfToExcel;