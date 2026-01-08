import { useState } from "react";
import FileUpload from "../../components/PdfTools/FileUpload";
import { DownloadPdfButton } from './DownloadButton';
import PDFService from '../../services/pdfService';

// RotatePdf.jsx
const RotatePdf = () => {
  const [files, setFiles] = useState([]);
  const [rotationSettings, setRotationSettings] = useState({
    angle: 90,
    pages: 'all'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleRotate = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to rotate');
      return;
    }

    setIsProcessing(true);
    setProcessedFile(null);
    try {
      const blob = await PDFService.rotatePDF(files[0], rotationSettings.angle);
      setProcessedFile({
        data: blob,
        fileName: files[0].name.replace('.pdf', '_rotated')
      });
      setResult('PDF pages rotated successfully!');
    } catch (error) {
      console.error('Error rotating PDF:', error);
      setResult('Failed to rotate PDF: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Rotate PDF</h1>
          <p className="text-gray-600">Rotate pages in PDF documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File to Rotate"
            description="Select a PDF file to rotate its pages"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Rotation Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation Angle
              </label>
              <select
                value={rotationSettings.angle}
                onChange={(e) => setRotationSettings(prev => ({...prev, angle: parseInt(e.target.value)}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={90}>90° Clockwise</option>
                <option value={180}>180°</option>
                <option value={270}>270° Clockwise (90° Counter-clockwise)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pages to Rotate
              </label>
              <select
                value={rotationSettings.pages}
                onChange={(e) => setRotationSettings(prev => ({...prev, pages: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Pages</option>
                <option value="odd">Odd Pages</option>
                <option value="even">Even Pages</option>
                <option value="first">First Page Only</option>
                <option value="last">Last Page Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleRotate}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Rotating...' : 'Rotate PDF'}
          </button>
        </div>

        {result && (
          <div className={`border rounded-lg p-4 ${result.includes('Failed') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <p className={result.includes('Failed') ? 'text-red-800' : 'text-green-800'}>{result}</p>
            {processedFile && (
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

export default RotatePdf;