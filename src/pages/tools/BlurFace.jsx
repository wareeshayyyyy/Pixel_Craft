import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
const BlurFace = () => {
  const [files, setFiles] = useState([]);
  const [blurIntensity, setBlurIntensity] = useState(5);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Blur Face</h1>
        <p className="text-lg text-gray-600 mb-8">
          Easily blur out faces in photos. You can also blur license plates and other objects to hide private information.
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
            <h3 className="text-lg font-medium mb-4">Blur Options</h3>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Blur Intensity ({blurIntensity})</label>
              <input
                type="range"
                min="1"
                max="10"
                value={blurIntensity}
                onChange={(e) => setBlurIntensity(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Light</span>
                <span>Strong</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Objects to Blur</label>
              <div className="flex flex-wrap gap-2">
                {['Faces', 'License Plates', 'People', 'Text', 'Custom Area'].map((item) => (
                  <button
                    key={item}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {item}
                  </button>
                ))}
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
              Apply Blur
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlurFace;