import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X } from 'lucide-react';

const ConvertToJpg = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImages, setConvertedImages] = useState([]);
  const [preserveTransparency, setPreserveTransparency] = useState(false);
  const [jpgQuality, setJpgQuality] = useState(90);

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/png', 'image/gif', 'image/tiff', 'image/svg+xml', 'image/webp'].includes(file.type)
    );
    setFiles(imageFiles);
    setConvertedImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const convertToJpg = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const converted = [];

    for (const file of files) {
      try {
        const jpgImage = await convertImageToJpg(file, jpgQuality, preserveTransparency);
        converted.push(jpgImage);
      } catch (error) {
        console.error('Conversion failed for:', file.name, error);
      }
    }

    setConvertedImages(converted);
    setIsProcessing(false);
  };

  const convertImageToJpg = (file, quality, keepTransparency) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Fill white background for JPG (unless preserving transparency)
        if (!keepTransparency) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const jpgFileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const convertedFile = new File([blob], jpgFileName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(convertedFile);
            } else {
              reject(new Error('Conversion failed'));
            }
          },
          'image/jpeg',
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
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    convertedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (convertedImages.length > 0) {
      const newConverted = convertedImages.filter((_, i) => i !== index);
      setConvertedImages(newConverted);
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Convert images to JPG</h1>
        <p className="text-lg text-gray-600 mb-8">
          Transform PNG, GIF, TIFF, PSD, SVG, WEBP, HEIC or RAW to JPG format.
          Convert many images to JPG online at once.
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
              acceptedFormats="image/png,image/gif,image/tiff,image/svg+xml,image/webp" 
              onFilesSelected={handleFileSelect}
              multiple
            />
            <p className="text-sm text-gray-400">Supports: PNG, GIF, TIFF, SVG, WEBP</p>
          </div>
        </div>

        {/* Conversion Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  JPG Quality: {jpgQuality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={jpgQuality}
                  onChange={(e) => setJpgQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={preserveTransparency}
                    onChange={(e) => setPreserveTransparency(e.target.checked)}
                    className="mr-2" 
                  />
                  <span>Preserve transparency (for PNG files) - adds white background if unchecked</span>
                </label>
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
                onClick={convertToJpg}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {isProcessing ? 'Converting...' : 'Convert to JPG'}
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

        {/* Converted Images */}
        {convertedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Converted Images ({convertedImages.length})
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
              {convertedImages.map((file, index) => (
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

export default ConvertToJpg;