import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X, Scissors } from 'lucide-react';

const RemoveBackground = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [tolerance, setTolerance] = useState(50);
  const [colorToRemove, setColorToRemove] = useState('#ffffff');
  const [method, setMethod] = useState('color'); // 'color', 'edges', 'smart'

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    setFiles(imageFiles);
    setProcessedImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeBackground = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const processed = [];

    for (const file of files) {
      try {
        const processedImage = await processBackgroundRemoval(file, method, colorToRemove, tolerance);
        processed.push(processedImage);
      } catch (error) {
        console.error('Background removal failed for:', file.name, error);
      }
    }

    setProcessedImages(processed);
    setIsProcessing(false);
  };

  const processBackgroundRemoval = (file, method, color, tolerance) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if (method === 'color') {
          removeColorBackground(data, color, tolerance);
        } else if (method === 'edges') {
          removeEdgeBasedBackground(data, tolerance);
        } else if (method === 'smart') {
          removeSmartBackground(data, tolerance);
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const processedFileName = file.name.replace(/(\.[^.]+)$/, '_no_bg.png');
              const processedFile = new File([blob], processedFileName, {
                type: 'image/png', // Always PNG to support transparency
                lastModified: Date.now(),
              });
              resolve(processedFile);
            } else {
              reject(new Error('Background removal failed'));
            }
          },
          'image/png'
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const removeColorBackground = (data, targetColor, tolerance) => {
    // Convert hex color to RGB
    const r = parseInt(targetColor.slice(1, 3), 16);
    const g = parseInt(targetColor.slice(3, 5), 16);
    const b = parseInt(targetColor.slice(5, 7), 16);

    for (let i = 0; i < data.length; i += 4) {
      const pixelR = data[i];
      const pixelG = data[i + 1];
      const pixelB = data[i + 2];

      // Calculate color difference
      const colorDiff = Math.sqrt(
        Math.pow(pixelR - r, 2) + 
        Math.pow(pixelG - g, 2) + 
        Math.pow(pixelB - b, 2)
      );

      if (colorDiff < tolerance * 4.41) { // 4.41 is sqrt(255^2 + 255^2 + 255^2) / 100
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
  };

  const removeEdgeBasedBackground = (data, sensitivity) => {
    const width = Math.sqrt(data.length / 4);
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      
      // Simple edge detection - remove pixels near edges
      if (x < sensitivity/10 || y < sensitivity/10 || 
          x > width - sensitivity/10 || y > Math.sqrt(data.length / 4) - sensitivity/10) {
        data[i + 3] = 0;
      }
    }
  };

  const removeSmartBackground = (data, threshold) => {
    // Simple algorithm: remove similar colored pixels starting from corners
    const corners = [0, data.length - 4]; // Top-left and bottom-right corners
    
    corners.forEach(cornerIndex => {
      const cornerR = data[cornerIndex];
      const cornerG = data[cornerIndex + 1];
      const cornerB = data[cornerIndex + 2];
      
      for (let i = 0; i < data.length; i += 4) {
        const colorDiff = Math.sqrt(
          Math.pow(data[i] - cornerR, 2) + 
          Math.pow(data[i + 1] - cornerG, 2) + 
          Math.pow(data[i + 2] - cornerB, 2)
        );
        
        if (colorDiff < threshold * 2) {
          data[i + 3] = Math.max(0, data[i + 3] - 128);
        }
      }
    });
  };

  const downloadImage = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    processedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (processedImages.length > 0) {
      const newProcessed = processedImages.filter((_, i) => i !== index);
      setProcessedImages(newProcessed);
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Remove Background</h1>
        <p className="text-lg text-gray-600 mb-8">
          Remove background from JPG, PNG or GIF images. 
          Make transparent backgrounds for your photos.
        </p>
        
        {/* File Upload Area */}
        <div className="bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300 mb-6"
             onDrop={handleDrop}
             onDragOver={handleDragOver}>
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-16 h-16 text-red-400" />
            <h2 className="text-xl font-medium">Select images</h2>
            <p className="text-gray-500">or drop images here</p>
            <FileUpload 
              acceptedFormats="image/*" 
              onFilesSelected={handleFileSelect}
              multiple
            />
            <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF</p>
          </div>
        </div>

        {/* Background Removal Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Background Removal Settings</h3>
            
            {/* Method Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Removal Method</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="color"
                    checked={method === 'color'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Color Based</div>
                    <div className="text-sm text-gray-500">Remove specific color</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="edges"
                    checked={method === 'edges'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Edge Detection</div>
                    <div className="text-sm text-gray-500">Remove from edges</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="smart"
                    checked={method === 'smart'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Smart Removal</div>
                    <div className="text-sm text-gray-500">Auto detect background</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Color Selection for Color-based method */}
            {method === 'color' && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Color to Remove</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={colorToRemove}
                    onChange={(e) => setColorToRemove(e.target.value)}
                    className="w-12 h-12 rounded border cursor-pointer"
                  />
                  <div className="flex space-x-2">
                    {['#ffffff', '#000000', '#00ff00', '#0000ff', '#ff0000'].map(color => (
                      <button
                        key={color}
                        onClick={() => setColorToRemove(color)}
                        className={`w-8 h-8 rounded border-2 ${colorToRemove === color ? 'border-red-500' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tolerance/Sensitivity Slider */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {method === 'color' ? 'Color Tolerance' : 'Sensitivity'}: {tolerance}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <strong>Note:</strong> Background removal works best with images that have clear contrast 
              between the subject and background. Results may vary depending on image complexity.
            </div>
          </div>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              <button
                onClick={removeBackground}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Scissors className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Remove Background'}</span>
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

        {/* Processed Images */}
        {processedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Processed Images ({processedImages.length})
              </h3>
              <button
                onClick={downloadAll}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedImages.map((file, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="text-sm truncate font-medium">{file.name}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • PNG with transparency
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
    </div>
  );
};

export default RemoveBackground;