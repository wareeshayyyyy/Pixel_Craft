import React, { useState } from 'react';
//import FileUpload from '../components/FileUpload';
import FileUpload from '../../components/FileUpload';
const CropImage = () => {
  const [files, setFiles] = useState([]);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Crop IMAGE</h1>
        <p className="text-lg text-gray-600 mb-8">
          Crop JPG, PNG or GIF by defining a rectangle in pixels.
          Cut your image online.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
          <h2 className="text-xl font-medium mb-4">Select images</h2>
          <p className="text-gray-500 mb-6">or drop images here</p>
          <FileUpload 
            acceptedFormats="image/*" 
            onFilesSelected={setFiles}
            multiple
          />
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Crop Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 mb-2">Crop Width (px)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter width"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Crop Height (px)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="Enter height"
                />
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
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Crop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropImage;