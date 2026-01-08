import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';

// ImageCompressor.js - Fixed component for image compression

import { Upload, Download, Settings, X } from 'lucide-react';

const ImageCompressor = ({ isHomePage = false }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [compressionLevel, setCompressionLevel] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);

  const handleFileSelect = useCallback((files) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)
    );
    setSelectedImages(imageFiles);
    setProcessedImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileInput = (e) => {
    handleFileSelect(e.target.files);
  };

  const compressImages = async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    const compressed = [];

    for (const image of selectedImages) {
      try {
        const compressedImage = await compressImage(image, compressionLevel);
        compressed.push(compressedImage);
      } catch (error) {
        console.error('Compression failed for:', image.name, error);
      }
    }

    setProcessedImages(compressed);
    setIsProcessing(false);
  };

  const compressImage = (file, quality) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          file.type,
          quality / 100
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
    a.download = `compressed_${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    processedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    if (processedImages.length > 0) {
      const newProcessed = processedImages.filter((_, i) => i !== index);
      setProcessedImages(newProcessed);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isHomePage && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Compress IMAGE</h1>
          <p className="text-gray-600">
            Compress JPG, PNG, SVG or GIF with the best quality and compression. 
            Reduce the filesize of your images at once.
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
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Choose Files
            </label>
            
            <p className="text-sm text-gray-400">
              Supports: JPG, PNG, GIF, SVG
            </p>
          </div>
        </div>
      </div>

      {/* Compression Settings */}
      {selectedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Compression Quality: {compressionLevel}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Selected Images */}
      {selectedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Selected Images ({selectedImages.length})</h3>
            <button
              onClick={compressImages}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {isProcessing ? 'Compressing...' : 'Compress Images'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedImages.map((file, index) => (
              <div key={index} className="border rounded-lg p-3 relative">
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="text-sm truncate font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
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
              Compressed Images ({processedImages.length})
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

export default ImageCompressor;