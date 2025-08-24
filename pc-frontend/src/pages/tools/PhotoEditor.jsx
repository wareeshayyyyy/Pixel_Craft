import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
const PhotoEditor = () => {
  const [files, setFiles] = useState([]);
  const [activeTool, setActiveTool] = useState('text');

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">Photo Editor</h1>
        <p className="text-lg text-gray-600 mb-8">
          Add text, stickers, effects and filters to your photos. Edit your photos online.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <h2 className="text-xl font-medium mb-4">Select image</h2>
              <FileUpload 
                acceptedFormats="image/*" 
                onFilesSelected={setFiles}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Editing Tools</h3>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button 
                    onClick={() => setActiveTool('text')}
                    className={`p-2 rounded ${activeTool === 'text' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                  >
                    Text
                  </button>
                  <button 
                    onClick={() => setActiveTool('stickers')}
                    className={`p-2 rounded ${activeTool === 'stickers' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                  >
                    Stickers
                  </button>
                  <button 
                    onClick={() => setActiveTool('filters')}
                    className={`p-2 rounded ${activeTool === 'filters' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                  >
                    Filters
                  </button>
                </div>

                {activeTool === 'text' && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Add Text</h4>
                    <input 
                      type="text" 
                      placeholder="Enter text" 
                      className="w-full p-2 border rounded mb-2"
                    />
                    <div className="grid grid-cols-5 gap-2">
                      {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'].map(color => (
                        <button 
                          key={color}
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3 bg-gray-100 rounded-lg flex items-center justify-center min-h-64">
            {files.length > 0 ? (
              <div className="relative">
                <img 
                  src={URL.createObjectURL(files[0])} 
                  alt="Preview" 
                  className="max-w-full max-h-96"
                />
                {activeTool === 'text' && (
                  <div className="absolute top-10 left-10 bg-white bg-opacity-75 p-2">
                    Your Text Here
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Image preview will appear here</p>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-8 text-right">
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Save Edited Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoEditor;