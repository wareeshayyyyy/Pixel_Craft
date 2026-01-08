import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Maximize2 } from 'lucide-react';

const ResizeImage = ({ isHomePage = false }) => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedImages, setResizedImages] = useState([]);
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState('dimensions'); // 'dimensions' or 'percentage'
  const [resizePercentage, setResizePercentage] = useState(50);

  const handleFileSelect = useCallback((selectedFiles) => {
    if (!selectedFiles) return;
    
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)
    );
    setFiles(imageFiles);
    setResizedImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const resizeImage = (file, width, height, keepAspect, mode, percentage) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let newWidth, newHeight;

        if (mode === 'percentage') {
          newWidth = Math.round(img.width * (percentage / 100));
          newHeight = Math.round(img.height * (percentage / 100));
        } else {
          if (keepAspect) {
            const aspectRatio = img.width / img.height;
            if (width / height > aspectRatio) {
              newWidth = Math.round(height * aspectRatio);
              newHeight = height;
            } else {
              newWidth = width;
              newHeight = Math.round(width / aspectRatio);
            }
          } else {
            newWidth = width;
            newHeight = height;
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFileName = file.name.replace(/(\.[^.]+)$/, '_resized$1');
              const resizedFile = new File([blob], resizedFileName, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Resizing failed'));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Image load failed'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const resizeImages = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const resized = [];

    for (const file of files) {
      try {
        const resizedImage = await resizeImage(file, resizeWidth, resizeHeight, maintainAspectRatio, resizeMode, resizePercentage);
        resized.push(resizedImage);
      } catch (error) {
        console.error('Resizing failed for:', file.name, error);
      }
    }

    setResizedImages(resized);
    setIsProcessing(false);
  };

  const downloadImage = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a); // Add to DOM
    a.click();
    document.body.removeChild(a); // Remove from DOM
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    resizedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (resizedImages.length > 0) {
      const newResized = resizedImages.filter((_, i) => i !== index);
      setResizedImages(newResized);
    }
  };

  const handleWidthChange = (width) => {
    if (width <= 0 || !width) return;
    
    setResizeWidth(width);
    if (maintainAspectRatio && files.length > 0) {
      // Calculate height based on first image's aspect ratio
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setResizeHeight(Math.round(width / aspectRatio));
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isHomePage && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resize IMAGE</h1>
          <p className="text-gray-600">
            Resize JPG, PNG, SVG or GIF by defining new height and width pixels.
            Change image dimensions online.
          </p>
        </div>
      )}
      
      {/* File Upload Area - Always visible */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div
          className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-16 h-16 text-red-400" />
            <h3 className="text-xl font-semibold text-gray-700">Select images</h3>
            <p className="text-gray-500">or drop images here</p>
            
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/svg+xml"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Choose Files
            </label>
            
            <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF, SVG</p>
          </div>
        </div>
      </div>

        {/* Resize Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Resize Settings</h3>
            
            {/* Resize Mode */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Resize Mode</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="dimensions"
                    checked={resizeMode === 'dimensions'}
                    onChange={(e) => setResizeMode(e.target.value)}
                    className="mr-2"
                  />
                  <span>By Dimensions</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="percentage"
                    checked={resizeMode === 'percentage'}
                    onChange={(e) => setResizeMode(e.target.value)}
                    className="mr-2"
                  />
                  <span>By Percentage</span>
                </label>
              </div>
            </div>

            {resizeMode === 'dimensions' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Width (px)</label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                      placeholder="Enter width"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Height (px)</label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => setResizeHeight(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                      placeholder="Enter height"
                      min="1"
                      disabled={maintainAspectRatio}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="mr-2"
                    />
                    <span>Maintain aspect ratio</span>
                  </label>
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Resize to {resizePercentage}% of original size
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={resizePercentage}
                  onChange={(e) => setResizePercentage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>10%</span>
                  <span>200%</span>
                </div>
              </div>
            )}

            {/* Quick Size Presets */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'HD (1280x720)', w: 1280, h: 720 },
                  { label: 'Full HD (1920x1080)', w: 1920, h: 1080 },
                  { label: 'Instagram (1080x1080)', w: 1080, h: 1080 },
                  { label: 'Facebook Cover (820x312)', w: 820, h: 312 },
                  { label: 'Twitter Header (1500x500)', w: 1500, h: 500 }
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setResizeWidth(preset.w);
                      setResizeHeight(preset.h);
                      setResizeMode('dimensions');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              <button
                onClick={resizeImages}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{isProcessing ? 'Resizing...' : 'Resize Images'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg relative">
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <span className="truncate pr-6">{file.name}</span>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resized Images */}
        {resizedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Resized Images ({resizedImages.length})
              </h3>
              <button
                onClick={downloadAll}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resizedImages.map((file, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="text-sm truncate font-medium">{file.name}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <button
                    onClick={() => downloadImage(file)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ResizeImage;