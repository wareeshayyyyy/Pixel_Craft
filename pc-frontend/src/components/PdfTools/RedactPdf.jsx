import { useState } from "react";
import PdfToolLayout from "../../components/PdfTools/PdfToolLayout";
import FileUpload from "../../components/PdfTools/FileUpload";
// RedactPdf.jsx
const RedactPdf = () => {
  const [files, setFiles] = useState([]);
  const [redactionSettings, setRedactionSettings] = useState({
    method: 'manual',
    searchText: '',
    color: 'black'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleRedact = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to redact');
      return;
    }

    if (redactionSettings.method === 'search' && !redactionSettings.searchText) {
      alert('Please enter text to search and redact');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDF redacted successfully!');
    } catch (error) {
      console.error('Error redacting PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Redact PDF</h1>
          <p className="text-gray-600">Remove or black out sensitive information</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File to Redact"
            description="Select a PDF file to redact sensitive information"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Redaction Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redaction Method
            </label>
            <select
              value={redactionSettings.method}
              onChange={(e) => setRedactionSettings(prev => ({...prev, method: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="manual">Manual Selection</option>
              <option value="search">Search and Redact</option>
              <option value="pattern">Pattern Recognition</option>
            </select>
          </div>

          {redactionSettings.method === 'search' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text to Search and Redact
              </label>
              <input
                type="text"
                value={redactionSettings.searchText}
                onChange={(e) => setRedactionSettings(prev => ({...prev, searchText: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter text to redact"/>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redaction Color
            </label>
            <select
              value={redactionSettings.color}
              onChange={(e) => setRedactionSettings(prev => ({...prev, color: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="red">Red</option>
            </select>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleRedact}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Redacting...' : 'Redact PDF'}
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

export default RedactPdf;