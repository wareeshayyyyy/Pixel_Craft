import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';

const CollageMaker = () => {
  const [files, setFiles] = useState([]);
  const [layout, setLayout] = useState('grid-2');

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">Collage Maker</h1>
        <p className="text-lg text-gray-600 mb-8">
          Combine multiple photos into beautiful collages. Choose from various layouts and customize your design.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 mb-6">
              <h2 className="text-xl font-medium mb-4">Add Photos</h2>
              <FileUpload 
                acceptedFormats="image/*" 
                onFilesSelected={setFiles}
                multiple
              />
            </div>

            {files.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Layout Options</h3>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {['grid-2', 'grid-3', 'vertical', 'horizontal', 'freeform'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setLayout(option)}
                      className={`p-2 border rounded ${layout === option ? 'bg-red-500 text-white border-red-500' : 'bg-white'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Background Color</label>
                  <div className="flex space-x-2">
                    {['#ffffff', '#000000', '#f3f4f6', '#fee2e2', '#dbeafe'].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3 bg-gray-100 rounded-lg p-6 min-h-96 flex items-center justify-center">
            {files.length > 0 ? (
              <div className={`grid ${layout === 'grid-2' ? 'grid-cols-2' : ''} ${layout === 'grid-3' ? 'grid-cols-3' : ''} gap-4 w-full`}>
                {files.slice(0, 4).map((file, index) => (
                  <div key={index} className="bg-white p-2 rounded overflow-hidden">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Collage ${index}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Your collage preview will appear here</p>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8 text-right">
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Create Collage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollageMaker;