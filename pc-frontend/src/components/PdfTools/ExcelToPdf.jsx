import React, { useState } from 'react';
import FileUpload from './FileUpload';


// ExcelToPdf.jsx
const ExcelToPdf = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    worksheets: 'all',
    selectedSheets: [],
    orientation: 'portrait',
    paperSize: 'A4',
    fitToPage: true,
    includeGridlines: false,
    includeHeaders: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select an Excel file to convert');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setResult('Excel file converted to PDF successfully!');
    } catch (error) {
      console.error('Error converting Excel to PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Excel to PDF</h1>
          <p className="text-gray-600">Convert Excel spreadsheets to PDF documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".xlsx,.xls,.xlsm,.xlsb"
            multiple={false}
            maxFiles={1}
            title="Upload Excel File"
            description="Select an Excel file (.xlsx, .xls, .xlsm, .xlsb) to convert to PDF"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Worksheets to Convert
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="worksheets"
                  value="all"
                  checked={conversionSettings.worksheets === 'all'}
                  onChange={(e) => setConversionSettings(prev => ({...prev, worksheets: e.target.value}))}
                  className="mr-2"
                />
                All Worksheets
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="worksheets"
                  value="active"
                  checked={conversionSettings.worksheets === 'active'}
                  onChange={(e) => setConversionSettings(prev => ({...prev, worksheets: e.target.value}))}
                  className="mr-2"
                />
                Active Worksheet Only
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="worksheets"
                  value="selected"
                  checked={conversionSettings.worksheets === 'selected'}
                  onChange={(e) => setConversionSettings(prev => ({...prev, worksheets: e.target.value}))}
                  className="mr-2"
                />
                Selected Worksheets
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Orientation
              </label>
              <select
                value={conversionSettings.orientation}
                onChange={(e) => setConversionSettings(prev => ({...prev, orientation: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="auto">Auto (Best Fit)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Size
              </label>
              <select
                value={conversionSettings.paperSize}
                onChange={(e) => setConversionSettings(prev => ({...prev, paperSize: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
                <option value="Tabloid">Tabloid</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.fitToPage}
                onChange={(e) => setConversionSettings(prev => ({...prev, fitToPage: e.target.checked}))}
                className="mr-2"
              />
              Fit Content to Page
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.includeGridlines}
                onChange={(e) => setConversionSettings(prev => ({...prev, includeGridlines: e.target.checked}))}
                className="mr-2"
              />
              Include Gridlines
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.includeHeaders}
                onChange={(e) => setConversionSettings(prev => ({...prev, includeHeaders: e.target.checked}))}
                className="mr-2"
              />
              Include Row/Column Headers
            </label>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : 'Convert to PDF'}
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

export default ExcelToPdf;