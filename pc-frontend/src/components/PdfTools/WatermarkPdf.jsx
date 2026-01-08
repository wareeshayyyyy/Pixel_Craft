import { useState } from "react";
import FileUpload from "../../components/PdfTools/FileUpload";
import { DownloadPdfButton } from './DownloadButton';
import PDFService from '../../services/pdfService';
import { getErrorMessage } from '../../utils/errorUtils';

// WatermarkPdf.jsx
const WatermarkPdf = () => {
  const [files, setFiles] = useState([]);
  const [watermarkSettings, setWatermarkSettings] = useState({
    type: 'text',
    text: '',
    opacity: 0.5,
    position: 'center',
    size: 'medium',
    rotation: 0,
    fontSize: 50
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setResult(null);
    setHasError(false);
    setProcessedFile(null);
  };

  const handleWatermark = async () => {
    console.log('handleWatermark called');
    console.log('Files state:', files);
    console.log('Files length:', files.length);
    
    if (files.length === 0) {
      console.log('No files selected');
      setResult('Please select a PDF file to watermark');
      setHasError(true);
      return;
    }

    if (watermarkSettings.type === 'text' && !watermarkSettings.text) {
      console.log('No watermark text entered');
      setResult('Please enter watermark text');
      setHasError(true);
      return;
    }

    console.log('Starting watermark process...');
    console.log('File to process:', files[0]);
    console.log('Watermark settings:', watermarkSettings);
    
    setIsProcessing(true);
    setProcessedFile(null);
    setResult(null);
    setHasError(false);
    
    try {
      const blob = await PDFService.watermarkPDF(files[0], watermarkSettings);
      console.log('Watermark successful, blob received:', blob);
      setProcessedFile({
        data: blob,
        fileName: files[0].name.replace('.pdf', '_watermarked')
      });
      setResult('Watermark added successfully!');
      setHasError(false);
    } catch (error) {
      console.error('Error adding watermark:', error);
      setResult(getErrorMessage(error));
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Watermark PDF</h1>
          <p className="text-gray-600">Add text or image watermarks to PDF files</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File"
            description="Select a PDF file to add watermark"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Watermark Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Watermark Type
              </label>
              <select
                value={watermarkSettings.type}
                onChange={(e) => setWatermarkSettings(prev => ({...prev, type: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="text">Text Watermark</option>
                <option value="image">Image Watermark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={watermarkSettings.position}
                onChange={(e) => setWatermarkSettings(prev => ({...prev, position: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="center">Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
          </div>

          {watermarkSettings.type === 'text' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkSettings.text}
                onChange={(e) => setWatermarkSettings(prev => ({...prev, text: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter watermark text"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacity: {Math.round(watermarkSettings.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={watermarkSettings.opacity}
                onChange={(e) => setWatermarkSettings(prev => ({...prev, opacity: parseFloat(e.target.value)}))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                value={watermarkSettings.size}
                onChange={(e) => setWatermarkSettings(prev => ({...prev, size: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {watermarkSettings.rotation}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="15"
                value={watermarkSettings.rotation}
                onChange={(e) => setWatermarkSettings(prev => ({...prev, rotation: parseInt(e.target.value)}))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {watermarkSettings.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={watermarkSettings.fontSize}
                onChange={(e) => setWatermarkSettings(prev => ({...prev, fontSize: parseInt(e.target.value)}))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleWatermark}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Adding Watermark...' : 'Add Watermark'}
          </button>
        </div>

        {result && (
          <div className={`border rounded-lg p-4 ${
            hasError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <p className={hasError ? 'text-red-800' : 'text-green-800'}>
              {result}
            </p>
            {processedFile && !hasError && (
              <div className="mt-4">
                <DownloadPdfButton
                  downloadData={processedFile.data}
                  fileName={processedFile.fileName}
                  isProcessing={isProcessing}
                  variant="success"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatermarkPdf;