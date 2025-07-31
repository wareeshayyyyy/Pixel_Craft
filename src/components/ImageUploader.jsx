import React, { useState } from 'react';

const ImageUploader = () => {
  const [images, setImages] = useState([]);

  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Upload Your Images</h2>
        <p className="text-gray-600 mb-4">Drag & drop files here or click to browse</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Select Files
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
