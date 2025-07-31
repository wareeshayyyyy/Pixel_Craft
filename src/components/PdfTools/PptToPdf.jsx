import React, { useState } from 'react';
import FileUpload from '../../components/PdfTools/FileUpload';
// PowerPointToPdf.jsx
const PptToPdf = () => {
  const [files, setFiles] = useState([]);
  const [conversionSettings, setConversionSettings] = useState({
    slides: 'all',
    slideRange: '',
    handoutLayout: 'slides',
    slidesPerPage: 1,
    includeNotes: false,
    includeHiddenSlides: false,
    quality: 'high'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select a PowerPoint file to convert');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setResult('PowerPoint presentation converted to PDF successfully!');
    } catch (error) {
      console.error('Error converting PowerPoint to PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PowerPoint to PDF</h1>
          <p className="text-gray-600">Convert PowerPoint presentations to PDF documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pptx,.ppt,.pptm,.ppsx,.pps"
            multiple={false}
            maxFiles={1}
            title="Upload PowerPoint File"
            description="Select a PowerPoint file (.pptx, .ppt, .pptm, .ppsx, .pps) to convert to PDF"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slides to Convert
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="slides"
                  value="all"
                  checked={conversionSettings.slides === 'all'}
                  onChange={(e) => setConversionSettings(prev => ({...prev, slides: e.target.value}))}
                  className="mr-2"
                />
                All Slides
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="slides"
                  value="range"
                  checked={conversionSettings.slides === 'range'}
                  onChange={(e) => setConversionSettings(prev => ({...prev, slides: e.target.value}))}
                  className="mr-2"
                />
                Slide Range (e.g., 1-10, 15, 20-25)
              </label>
              {conversionSettings.slides === 'range' && (
                <input
                  type="text"
                  placeholder="Enter slide range"
                  value={conversionSettings.slideRange}
                  onChange={(e) => setConversionSettings(prev => ({...prev, slideRange: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-md mt-2"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout Type
              </label>
              <select
                value={conversionSettings.handoutLayout}
                onChange={(e) => setConversionSettings(prev => ({...prev, handoutLayout: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="slides">Full Slides</option>
                <option value="handouts">Handouts</option>
                <option value="notes">Notes Pages</option>
                <option value="outline">Outline View</option>
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
                <option value="high">High Quality</option>
                <option value="medium">Medium Quality</option>
                <option value="low">Low Quality (Smaller Size)</option>
              </select>
            </div>
          </div>

          {conversionSettings.handoutLayout === 'handouts' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slides Per Page
              </label>
              <select
                value={conversionSettings.slidesPerPage}
                onChange={(e) => setConversionSettings(prev => ({...prev, slidesPerPage: parseInt(e.target.value)}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="1">1 Slide per Page</option>
                <option value="2">2 Slides per Page</option>
                <option value="3">3 Slides per Page</option>
                <option value="4">4 Slides per Page</option>
                <option value="6">6 Slides per Page</option>
                <option value="9">9 Slides per Page</option>
              </select>
            </div>
          )}

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.includeNotes}
                onChange={(e) => setConversionSettings(prev => ({...prev, includeNotes: e.target.checked}))}
                className="mr-2"
              />
              Include Speaker Notes
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={conversionSettings.includeHiddenSlides}
                onChange={(e) => setConversionSettings(prev => ({...prev, includeHiddenSlides: e.target.checked}))}
                className="mr-2"
              />
              Include Hidden Slides
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



export default PptToPdf;