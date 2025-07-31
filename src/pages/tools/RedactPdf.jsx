import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';

const RedactPdf = () => {
  const [files, setFiles] = useState([]);
  const [redactionType, setRedactionType] = useState('text');

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Redact PDF</h1>
        <p className="text-lg text-gray-600 mb-8">
          Permanently remove sensitive content from your PDF documents. Securely black out text, images, or entire sections.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 mb-8">
          <h2 className="text-xl font-medium mb-4">Select PDF files</h2>
          <p className="text-gray-500 mb-6">or drop files here</p>
          <FileUpload 
            acceptedFormats=".pdf" 
            onFilesSelected={setFiles}
            multiple
          />
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Redaction Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 mb-2">Redaction Type</label>
                <select
                  value={redactionType}
                  onChange={(e) => setRedactionType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="text">Text</option>
                  <option value="images">Images</option>
                  <option value="area">Custom Area</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Sensitivity Level</label>
                <select className="w-full p-2 border rounded">
                  <option>Standard</option>
                  <option>High Security</option>
                  <option>Complete Removal</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Selected Files ({files.length})</h3>
            <div className="space-y-3 mb-6">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <span>{file.name}</span>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Permanently remove content (cannot be undone)</span>
              </label>
            </div>
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Redact Documents
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedactPdf;