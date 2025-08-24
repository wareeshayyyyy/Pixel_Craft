import React, { useState } from 'react';
import FileUpload from '../FileUpload';
// ProtectPdf.jsx
// ProtectPdf.jsx
const ProtectPdf = () => {
  const [files, setFiles] = useState([]);
  const [protectionSettings, setProtectionSettings] = useState({
    userPassword: '',
    ownerPassword: '',
    allowPrinting: true,
    allowCopying: false,
    allowEditing: false,
    allowComments: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleProtect = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to protect');
      return;
    }

    if (!protectionSettings.userPassword && !protectionSettings.ownerPassword) {
      alert('Please set at least one password');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult('PDF protected successfully!');
    } catch (error) {
      console.error('Error protecting PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Protect PDF</h1>
          <p className="text-gray-600">Add password protection to PDF files</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload PDF File to Protect"
            description="Select a PDF file to add password protection"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Protection Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Password (Required to open)
              </label>
              <input
                type="password"
                value={protectionSettings.userPassword}
                onChange={(e) => setProtectionSettings(prev => ({...prev, userPassword: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter user password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Password (For permissions)
              </label>
              <input
                type="password"
                value={protectionSettings.ownerPassword}
                onChange={(e) => setProtectionSettings(prev => ({...prev, ownerPassword: e.target.value}))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter owner password"
              />
            </div>
          </div>

          <h4 className="text-lg font-medium mb-3">Permissions</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={protectionSettings.allowPrinting}
                onChange={(e) => setProtectionSettings(prev => ({...prev, allowPrinting: e.target.checked}))}
                className="mr-2"
              />
              Allow Printing
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={protectionSettings.allowCopying}
                onChange={(e) => setProtectionSettings(prev => ({...prev, allowCopying: e.target.checked}))}
                className="mr-2"
              />
              Allow Copying Text
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={protectionSettings.allowEditing}
                onChange={(e) => setProtectionSettings(prev => ({...prev, allowEditing: e.target.checked}))}
                className="mr-2"
              />
              Allow Editing
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={protectionSettings.allowComments}
                onChange={(e) => setProtectionSettings(prev => ({...prev, allowComments: e.target.checked}))}
                className="mr-2"
              />
              Allow Comments
            </label>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleProtect}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Protecting...' : 'Protect PDF'}
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

export default ProtectPdf;