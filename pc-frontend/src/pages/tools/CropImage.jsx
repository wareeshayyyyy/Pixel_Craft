import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X, Crop } from 'lucide-react';

const CropImage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedImages, setCroppedImages] = useState([]);
  const [cropWidth, setCropWidth] = useState(300);
  const [cropHeight, setCropHeight] = useState(300);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('custom');

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    setFiles(imageFiles);
    setCroppedImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const cropImages = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const cropped = [];

    for (const file of files) {
      try {
        const croppedImage = await cropImage(file, cropX, cropY, cropWidth, cropHeight);
        cropped.push(croppedImage);
      } catch (error) {
        console.error('Cropping failed for:', file.name, error);
      }
    }

    setCroppedImages(cropped);
    setIsProcessing(false);
  };

  const cropImage = (file, x, y, width, height) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Ensure crop dimensions don't exceed image dimensions
        const actualX = Math.max(0, Math.min(x, img.width - width));
        const actualY = Math.max(0, Math.min(y, img.height - height));
        const actualWidth = Math.min(width, img.width - actualX);
        const actualHeight = Math.min(height, img.height - actualY);

        canvas.width = actualWidth;
        canvas.height = actualHeight;

        ctx.drawImage(img, actualX, actualY, actualWidth, actualHeight, 0, 0, actualWidth, actualHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const croppedFileName = file.name.replace(/(\.[^.]+)$/, '_cropped$1');
              const croppedFile = new File([blob], croppedFileName, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(croppedFile);
            } else {
              reject(new Error('Cropping failed'));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
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
    croppedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (croppedImages.length > 0) {
      const newCropped = croppedImages.filter((_, i) => i !== index);
      setCroppedImages(newCropped);
    }
  };

  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio);
    if (ratio !== 'custom') {
      const [w, h] = ratio.split(':').map(Number);
      if (w && h) {
        const newHeight = Math.round(cropWidth * (h / w));
        setCropHeight(newHeight);
      }
    }
  };

  const handleWidthChange = (width) => {
    setCropWidth(width);
    if (aspectRatio !== 'custom') {
      const [w, h] = aspectRatio.split(':').map(Number);
      if (w && h) {
        const newHeight = Math.round(width * (h / w));
        setCropHeight(newHeight);
      }
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Crop IMAGE</h1>
        <p className="text-lg text-gray-600 mb-8">
          Crop JPG, PNG or GIF by defining a rectangle in pixels.
          Cut your image online.
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

        {/* Crop Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Crop Settings</h3>
            
            {/* Aspect Ratio */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {['custom', '1:1', '4:3', '16:9', '3:2', '2:3'].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => handleAspectRatioChange(ratio)}
                    className={`px-3 py-1 rounded text-sm ${aspectRatio === ratio ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {ratio === 'custom' ? 'Custom' : ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Crop Width (px)</label>
                <input
                  type="number"
                  value={cropWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter width"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Crop Height (px)</label>
                <input
                  type="number"
                  value={cropHeight}
                  onChange={(e) => setCropHeight(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter height"
                  min="1"
                  disabled={aspectRatio !== 'custom'}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Start X (px)</label>
                <input
                  type="number"
                  value={cropX}
                  onChange={(e) => setCropX(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="X position"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Start Y (px)</label>
                <input
                  type="number"
                  value={cropY}
                  onChange={(e) => setCropY(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="Y position"
                  min="0"
                />
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
                onClick={cropImages}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Crop className="w-4 h-4" />
                <span>{isProcessing ? 'Cropping...' : 'Crop Images'}</span>
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
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cropped Images */}
        {croppedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Cropped Images ({croppedImages.length})
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
              {croppedImages.map((file, index) => (
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
    </div>
  );
};

export default CropImage;