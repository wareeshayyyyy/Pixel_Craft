import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X, TrendingUp } from 'lucide-react';

const UpscaleImage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upscaledImages, setUpscaledImages] = useState([]);
  const [scaleFactor, setScaleFactor] = useState(2);
  const [upscaleMethod, setUpscaleMethod] = useState('bicubic'); // 'bicubic', 'bilinear', 'nearest'
  const [enhanceSharpness, setEnhanceSharpness] = useState(true);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [useCustomSize, setUseCustomSize] = useState(false);

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    setFiles(imageFiles);
    setUpscaledImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const upscaleImages = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const upscaled = [];

    for (const file of files) {
      try {
        const upscaledImage = await upscaleImage(
          file, 
          scaleFactor, 
          upscaleMethod, 
          enhanceSharpness,
          useCustomSize,
          customWidth,
          customHeight
        );
        upscaled.push(upscaledImage);
      } catch (error) {
        console.error('Upscaling failed for:', file.name, error);
      }
    }

    setUpscaledImages(upscaled);
    setIsProcessing(false);
  };

  const upscaleImage = (file, factor, method, sharpen, customSize, width, height) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let newWidth, newHeight;

        if (customSize && width && height) {
          newWidth = parseInt(width);
          newHeight = parseInt(height);
        } else {
          newWidth = Math.round(img.width * factor);
          newHeight = Math.round(img.height * factor);
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Set interpolation method
        switch (method) {
          case 'nearest':
            ctx.imageSmoothingEnabled = false;
            break;
          case 'bilinear':
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'low';
            break;
          case 'bicubic':
          default:
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            break;
        }

        // Draw the upscaled image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Apply sharpening filter if enabled
        if (sharpen) {
          applySharpeningFilter(ctx, newWidth, newHeight);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const upscaledFileName = file.name.replace(/(\.[^.]+)$/, `_upscaled_${factor}x$1`);
              const upscaledFile = new File([blob], upscaledFileName, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(upscaledFile);
            } else {
              reject(new Error('Upscaling failed'));
            }
          },
          file.type,
          0.95
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const applySharpeningFilter = (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const sharpenKernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const newData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let channel = 0; channel < 3; channel++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + channel;
              const kernelIndex = (ky + 1) * 3 + (kx + 1);
              sum += data[pixelIndex] * sharpenKernel[kernelIndex];
            }
          }
          const currentIndex = (y * width + x) * 4 + channel;
          newData[currentIndex] = Math.max(0, Math.min(255, sum));
        }
      }
    }

    const newImageData = new ImageData(newData, width, height);
    ctx.putImageData(newImageData, 0, 0);
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
    upscaledImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (upscaledImages.length > 0) {
      const newUpscaled = upscaledImages.filter((_, i) => i !== index);
      setUpscaledImages(newUpscaled);
    }
  };

  const scaleFactors = [
    { value: 1.5, label: '1.5x (50% larger)' },
    { value: 2, label: '2x (Double size)' },
    { value: 3, label: '3x (Triple size)' },
    { value: 4, label: '4x (Quadruple size)' },
    { value: 5, label: '5x (5x larger)' }
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Upscale IMAGE</h1>
        <p className="text-lg text-gray-600 mb-8">
          Increase image resolution and size using advanced upscaling algorithms. 
          Enhance your photos while maintaining quality.
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

        {/* Upscale Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Upscale Settings</h3>
            
            {/* Size Method Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Upscale Method</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!useCustomSize}
                    onChange={() => setUseCustomSize(false)}
                    className="mr-2"
                  />
                  <span>Scale Factor</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={useCustomSize}
                    onChange={() => setUseCustomSize(true)}
                    className="mr-2"
                  />
                  <span>Custom Dimensions</span>
                </label>
              </div>
            </div>

            {/* Scale Factor Selection */}
            {!useCustomSize && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-3">Scale Factor</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {scaleFactors.map(factor => (
                    <button
                      key={factor.value}
                      onClick={() => setScaleFactor(factor.value)}
                      className={`p-3 border rounded text-center ${scaleFactor === factor.value ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {factor.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-gray-700 mb-2">Custom Scale: {scaleFactor}x</label>
                  <input
                    type="range"
                    min="1.1"
                    max="10"
                    step="0.1"
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1.1x</span>
                    <span>10x</span>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Dimensions */}
            {useCustomSize && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-3">Custom Dimensions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter width"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter height"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Upscaling Algorithm */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Upscaling Algorithm</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="bicubic"
                    checked={upscaleMethod === 'bicubic'}
                    onChange={(e) => setUpscaleMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Bicubic</div>
                    <div className="text-sm text-gray-500">Best quality (recommended)</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="bilinear"
                    checked={upscaleMethod === 'bilinear'}
                    onChange={(e) => setUpscaleMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Bilinear</div>
                    <div className="text-sm text-gray-500">Balanced quality & speed</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="nearest"
                    checked={upscaleMethod === 'nearest'}
                    onChange={(e) => setUpscaleMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Nearest Neighbor</div>
                    <div className="text-sm text-gray-500">Pixel art style</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Enhancement Options */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-3">Enhancement Options</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enhanceSharpness}
                  onChange={(e) => setEnhanceSharpness(e.target.checked)}
                  className="mr-2"
                />
                <span>Apply sharpening filter (improves detail clarity)</span>
              </label>
            </div>

            {/* Quality Warning */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <strong>Note:</strong> Upscaling increases file size significantly. Very large scale factors 
              may result in huge files and longer processing times. For best results with photos, 
              use bicubic interpolation with sharpening enabled.
            </div>
          </div>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              <button
                onClick={upscaleImages}
                disabled={isProcessing || (useCustomSize && (!customWidth || !customHeight))}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>{isProcessing ? 'Upscaling...' : 'Upscale Images'}</span>
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

            {/* Preview of expected output */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-sm text-yellow-800">
                <strong>Expected output:</strong> {useCustomSize ? 'Custom size' : `${scaleFactor}x larger`}
                {!useCustomSize && ` (approx. ${(scaleFactor * scaleFactor * files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB total)`}
              </div>
            </div>
          </div>
        )}

        {/* Upscaled Images */}
        {upscaledImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Upscaled Images ({upscaledImages.length})
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
              {upscaledImages.map((file, index) => (
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

export default UpscaleImage;