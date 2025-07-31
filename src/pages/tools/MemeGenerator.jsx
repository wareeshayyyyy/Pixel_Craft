import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
const MemeGenerator = () => {
  const [files, setFiles] = useState([]);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Meme Generator</h1>
        <p className="text-lg text-gray-600 mb-8">
          Create your memes online with ease. Caption meme images or upload your pictures to make custom memes.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 mb-8">
          <h2 className="text-xl font-medium mb-4">Select image</h2>
          <p className="text-gray-500 mb-6">or drop image here</p>
          <FileUpload 
            acceptedFormats="image/*" 
            onFilesSelected={setFiles}
          />
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Meme Text</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Top Text</label>
                    <input
                      type="text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter top text"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Bottom Text</label>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter bottom text"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Text Color</label>
                    <div className="flex space-x-2">
                      {['white', 'black', 'red', 'blue', 'yellow'].map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border ${color === 'white' ? 'border-gray-300' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-64">
                <img 
                  src={URL.createObjectURL(files[0])} 
                  alt="Meme preview" 
                  className="max-w-full max-h-96"
                />
                {topText && (
                  <div className="absolute top-4 left-0 right-0 text-center text-white text-2xl font-bold">
                    {topText}
                  </div>
                )}
                {bottomText && (
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white text-2xl font-bold">
                    {bottomText}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-right">
              <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Download Meme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemeGenerator;