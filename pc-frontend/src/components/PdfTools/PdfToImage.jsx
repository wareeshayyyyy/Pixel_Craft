/* import React, { useState } from 'react';

const PdfToImage = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'png',
    quality: 'high',
    dpi: 300,
    pages: 'all',
    colorMode: 'color',
    outputType: 'separate'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState([]);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setResult(null);
    setDownloadUrls([]);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to convert');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - in a real app, this would be the actual conversion result
      const mockUrls = [
        'https://via.placeholder.com/800x1130.png?text=Page+1',
        'https://via.placeholder.com/800x1130.png?text=Page+2',
        'https://via.placeholder.com/800x1130.png?text=Page+3'
      ];
      
      setResult(`Successfully converted ${files[0].name} to ${conversionSettings.format.toUpperCase()}`);
      setDownloadUrls(mockUrls);
    } catch (error) {
      console.error('Error converting PDF:', error);
      setResult('Error converting PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-page-${Date.now()}.${conversionSettings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to convert to images"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Format
              </label>
              <select
                value={conversionSettings.format}
                onChange={(e) => setConversionSettings(prev => ({...prev, format: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPEG</option>
                <option value="webp">WebP</option>
                <option value="tiff">TIFF</option>
                <option value="bmp">BMP</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality
              </label>
              <select
                value={conversionSettings.quality}
                onChange={(e) => setConversionSettings(prev => ({...prev, quality: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DPI (Resolution)
              </label>
              <select
                value={conversionSettings.dpi}
                onChange={(e) => setConversionSettings(prev => ({...prev, dpi: parseInt(e.target.value)}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="72">72 (Screen)</option>
                <option value="150">150 (Good)</option>
                <option value="300">300 (Print)</option>
                <option value="600">600 (High Quality)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pages
              </label>
              <select
                value={conversionSettings.pages}
                onChange={(e) => setConversionSettings(prev => ({...prev, pages: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Pages</option>
                <option value="first">First Page Only</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {conversionSettings.pages === 'custom' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Range (e.g., 1-3,5,7-9)
                </label>
                <input
                  type="text"
                  placeholder="Enter page range"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Mode
              </label>
              <select
                value={conversionSettings.colorMode}
                onChange={(e) => setConversionSettings(prev => ({...prev, colorMode: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="color">Color</option>
                <option value="grayscale">Grayscale</option>
                <option value="blackwhite">Black & White</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Type
              </label>
              <select
                value={conversionSettings.outputType}
                onChange={(e) => setConversionSettings(prev => ({...prev, outputType: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="separate">Separate Files</option>
                <option value="combined">Combined (ZIP)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleConvert}
              disabled={isProcessing || files.length === 0}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isProcessing || files.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </span>
              ) : (
                'Convert to Images'
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-green-600 mb-2">{result}</h3>
              {downloadUrls.length > 0 && (
                <p className="text-gray-600">
                  {downloadUrls.length} {downloadUrls.length === 1 ? 'page' : 'pages'} converted
                </p>
              )}
            </div>

            {downloadUrls.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Converted Pages:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {downloadUrls.map((url, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <img 
                        src={url} 
                        alt={`Page ${index + 1}`} 
                        className="w-full h-auto mb-2 border"
                      />
                      <button
                        onClick={() => handleDownload(url)}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Download Page {index + 1}
                      </button>
                    </div>
                  ))}
                </div>

                {conversionSettings.outputType === 'separate' && downloadUrls.length > 1 && (
                  <button
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium mt-4"
                  >
                    Download All as ZIP
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// FileUpload component (mock implementation - you should replace with your actual component)
const FileUpload = ({ onFilesSelected, acceptedTypes, multiple, maxFiles, title, description }) => {
  const handleChange = (e) => {
    onFilesSelected(Array.from(e.target.files));
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
        Select File
        <input
          type="file"
          className="hidden"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleChange}
        />
      </label>
      <p className="text-xs text-gray-500 mt-2">Supported: {acceptedTypes}</p>
    </div>
  );
};

export default PdfToImage; */


import React, { useState } from 'react';
import FileUpload from '../FileUpload';

// PdfToImage.jsx
const PdfToImage = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'png',
    quality: 300,
    pages: 'all',
    pageRange: ''
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
      setResult('PDF pages converted to images successfully!');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Image</h1>
          <p className="text-gray-600">Convert PDF pages to image files</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to convert to images"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Format
              </label>
              <select
                value={conversionSettings.format}
                onChange={(e) => setConversionSettings(prev => ({...prev, format: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPEG</option>
                <option value="tiff">TIFF</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality (DPI)
              </label>
              <select
                value={conversionSettings.quality}
                onChange={(e) => setConversionSettings(prev => ({...prev, quality: parseInt(e.target.value)}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="150">150 DPI (Web)</option>
                <option value="300">300 DPI (Print)</option>
                <option value="600">600 DPI (High Quality)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pages to Convert
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pages"
                  value="all"
                  checked={conversionSettings.pages === 'all'}
                  onChange={(e) => setConversionSettings(prev => ({...prev, pages: e.target.value}))}
                  className="mr-2"
                />
                All Pages
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pages"
                  value="range"
                  checked={conversionSettings.pages === 'range'}
                  onChange={(e) => setConversionSettings(prev => ({...prev, pages: e.target.value}))}
                  className="mr-2"
                />
                Page Range (e.g., 1-5, 7, 10-12)
              </label>
              {conversionSettings.pages === 'range' && (
                <input
                  type="text"
                  placeholder="Enter page range"
                  value={conversionSettings.pageRange}
                  onChange={(e) => setConversionSettings(prev => ({...prev, pageRange: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                />
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleConvert}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Converting...' : 'Convert to Images'}
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

export default PdfToImage; 



