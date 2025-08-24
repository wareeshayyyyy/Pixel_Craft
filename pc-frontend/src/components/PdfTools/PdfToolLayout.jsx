import React from 'react';
import { FiUpload, FiDownload, FiSettings, FiTrash2 } from 'react-icons/fi';

const PdfToolLayout = ({ title, icon, description, options, onProcess, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="text-blue-500 mr-4">{icon}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
              
              {children}
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onProcess}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
                >
                  <FiDownload className="mr-2" />
                  Process PDF
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg flex items-center justify-center">
                  <FiTrash2 className="mr-2" />
                  Clear Files
                </button>
              </div>
            </div>
          </div>
          
          {/* Options Panel */}
          <div className="md:w-80">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex items-center mb-4">
                <FiSettings className="text-gray-500 mr-2" />
                <h2 className="font-medium text-gray-800">Options</h2>
              </div>
              {options}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToolLayout;