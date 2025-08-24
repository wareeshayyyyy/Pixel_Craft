import { useState, useRef } from "react";
import PdfToolLayout from "../../components/PdfTools/PdfToolLayout";
import FileUpload from "../../components/PdfTools/FileUpload";

// SignPdf.jsx - Fixed to avoid object rendering error
const SignPdf = () => {
  const [files, setFiles] = useState([]);
  const [signatureSettings, setSignatureSettings] = useState({
    signatureType: 'text',
    position: 'bottom-right',
    page: 'last',
    reason: '',
    contactInfo: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleSign = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to sign');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDF signed successfully!');
    } catch (error) {
      console.error('Error signing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign PDF</h1>
          <p className="text-gray-600">Add digital signatures to PDF documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File to Sign"
            description="Select a PDF file to add digital signature"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Signature Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature Type
              </label>
              <select
                value={signatureSettings.signatureType}
                onChange={(e) => setSignatureSettings(prev => ({...prev, signatureType: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="text">Text Signature</option>
                <option value="image">Image Signature</option>
                <option value="digital">Digital Certificate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={signatureSettings.position}
                onChange={(e) => setSignatureSettings(prev => ({...prev, position: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="center">Center</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page
              </label>
              <select
                value={signatureSettings.page}
                onChange={(e) => setSignatureSettings(prev => ({...prev, page: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="first">First Page</option>
                <option value="last">Last Page</option>
                <option value="all">All Pages</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Signing
              </label>
              <input
                type="text"
                value={signatureSettings.reason}
                onChange={(e) => setSignatureSettings(prev => ({...prev, reason: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter reason"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Information
            </label>
            <input
              type="text"
              value={signatureSettings.contactInfo}
              onChange={(e) => setSignatureSettings(prev => ({...prev, contactInfo: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter contact information"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleSign}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Signing...' : 'Sign PDF'}
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

export default SignPdf;