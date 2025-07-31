import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
const RotateImage = () => {
  const [files, setFiles] = useState([]);
  const [angle, setAngle] = useState(90);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Rotate IMAGE</h1>
        <p className="text-lg text-gray-600 mb-8">
          Rotate many images at same time. Choose to rotate only landscape or portrait images!
        </p>
        
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 mb-8">
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
            <h3 className="text-lg font-medium mb-4">Rotation Options</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[90, 180, 270, 'custom'].map((option) => (
                <button
                  key={option}
                  onClick={() => option !== 'custom' && setAngle(option)}
                  className={`p-3 border rounded-lg text-center ${angle === option ? 'bg-red-500 text-white border-red-500' : 'bg-white'}`}
                >
                  {option === 'custom' ? 'Custom Angle' : `${option}°`}
                </button>
              ))}
            </div>

            {angle === 'custom' && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Custom Angle (degrees)</label>
                <input
                  type="number"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="360"
                />
              </div>
            )}

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
              Rotate Images
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RotateImage;