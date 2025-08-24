import React, { useState } from 'react';

const HtmlToImage = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('jpg');

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">HTML to IMAGE</h1>
        <p className="text-lg text-gray-600 mb-8">
          Convert webpages in HTML to JPG or SVG. Copy and paste the URL of the page you want and convert it to IMAGE with a click.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 mb-8">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Resolution</label>
              <select className="w-full p-2 border rounded">
                <option>Full Page</option>
                <option>Viewport Size</option>
                <option>Custom Size</option>
              </select>
            </div>
          </div>
        </div>

        {url && (
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Convert to {format.toUpperCase()}
            </button>
            <p className="text-gray-500 mt-4">Preview will appear here after conversion</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HtmlToImage;