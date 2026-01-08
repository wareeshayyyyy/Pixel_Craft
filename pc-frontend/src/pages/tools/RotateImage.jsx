import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X, RotateCw, RotateCcw } from 'lucide-react';

const RotateImage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotatedImages, setRotatedImages] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(90);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    setFiles(imageFiles);
    setRotatedImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const rotateImages = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const rotated = [];

    for (const file of files) {
      try {
        const rotatedImage = await rotateImage(file, rotationAngle, flipHorizontal, flipVertical);
        rotated.push(rotatedImage);
      } catch (error) {
        console.error('Rotation failed for:', file.name, error);
      }
    }

    setRotatedImages(rotated);
    setIsProcessing(false);
  };

  const rotateImage = (file, angle, flipH, flipV) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const radians = (angle * Math.PI) / 180;
        
        // Calculate new canvas dimensions after rotation
        const cos = Math.abs(Math.cos(radians));
        const sin = Math.abs(Math.sin(radians));
        const newWidth = Math.ceil(img.width * cos + img.height * sin);
        const newHeight = Math.ceil(img.width * sin + img.height * cos);

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Save the current context state
        ctx.save();

        // Move to center of canvas
        ctx.translate(newWidth / 2, newHeight / 2);

        // Apply transformations
        if (flipH) ctx.scale(-1, 1);
        if (flipV) ctx.scale(1, -1);
        
        // Rotate
        ctx.rotate(radians);

        // Draw image centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // Restore context state
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const rotatedFileName = file.name.replace(/(\.[^.]+)$/, '_rotated$1');
              const rotatedFile = new File([blob], rotatedFileName, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(rotatedFile);
            } else {
              reject(new Error('Rotation failed'));
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
    rotatedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (rotatedImages.length > 0) {
      const newRotated = rotatedImages.filter((_, i) => i !== index);
      setRotatedImages(newRotated);
    }
  };

  const quickRotate = (angle) => {
    setRotationAngle(angle);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Rotate IMAGE</h1>
        <p className="text-lg text-gray-600 mb-8">
          Rotate JPG, PNG or GIF images online. Specify degrees to rotate, 
          apply horizontal or vertical flips.
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

        {/* Rotation Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Rotation Settings</h3>
            
            {/* Quick Rotation Buttons */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Quick Rotations</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => quickRotate(90)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${rotationAngle === 90 && !flipHorizontal && !flipVertical ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <RotateCw className="w-4 h-4" />
                  <span>90° Right</span>
                </button>
                <button
                  onClick={() => quickRotate(180)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${rotationAngle === 180 && !flipHorizontal && !flipVertical ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <RotateCw className="w-4 h-4" />
                  <span>180°</span>
                </button>
                <button
                  onClick={() => quickRotate(270)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${rotationAngle === 270 && !flipHorizontal && !flipVertical ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>90° Left</span>
                </button>
              </div>
            </div>

            {/* Custom Angle */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Custom Rotation: {rotationAngle}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>-180°</span>
                <span>0°</span>
                <span>180°</span>
              </div>
              <input
                type="number"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                className="mt-2 w-32 p-2 border rounded text-center"
                min="-360"
                max="360"
                placeholder="Degrees"
              />
            </div>

            {/* Flip Options */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-3">Flip Options</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={flipHorizontal}
                    onChange={(e) => setFlipHorizontal(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Flip Horizontal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={flipVertical}
                    onChange={(e) => setFlipVertical(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Flip Vertical</span>
                </label>
              </div>
            </div>

            {/* Preview Settings */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Current Settings:</strong>
              <br />
              Rotation: {rotationAngle}°
              {flipHorizontal && ', Horizontal Flip'}
              {flipVertical && ', Vertical Flip'}
            </div>
          </div>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              <button
                onClick={rotateImages}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>{isProcessing ? 'Rotating...' : 'Rotate Images'}</span>
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

        {/* Rotated Images */}
        {rotatedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Rotated Images ({rotatedImages.length})
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
              {rotatedImages.map((file, index) => (
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

export default RotateImage;