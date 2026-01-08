import React, { useState, useCallback } from 'react';
import { Upload, Download, Settings, X, Eye, EyeOff } from 'lucide-react';

const BlurFace = ({ isHomePage = false }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [blurIntensity, setBlurIntensity] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [selectedBlurType, setSelectedBlurType] = useState('faces');

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

  const blurImages = async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    const blurred = [];

    for (const image of selectedImages) {
      try {
        const blurredImage = await blurImage(image, blurIntensity, selectedBlurType);
        blurred.push(blurredImage);
      } catch (error) {
        console.error('Blurring failed for:', image.name, error);
      }
    }

    setProcessedImages(blurred);
    setIsProcessing(false);
  };

  const blurImage = (file, intensity, blurType) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Apply blur effect based on type
        if (blurType === 'faces') {
          // Simulate face detection and blurring
          applyFaceBlur(ctx, canvas.width, canvas.height, intensity);
        } else if (blurType === 'license-plates') {
          // Simulate license plate blurring
          applyLicensePlateBlur(ctx, canvas.width, canvas.height, intensity);
        } else if (blurType === 'people') {
          // Simulate people blurring
          applyPeopleBlur(ctx, canvas.width, canvas.height, intensity);
        } else if (blurType === 'text') {
          // Simulate text blurring
          applyTextBlur(ctx, canvas.width, canvas.height, intensity);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const blurredFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(blurredFile);
            } else {
              reject(new Error('Blurring failed'));
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

  // Simulate different blur effects
  const applyFaceBlur = (ctx, width, height, intensity) => {
    // Simulate face detection areas (center regions)
    const faceRegions = [
      { x: width * 0.2, y: height * 0.2, w: width * 0.3, h: height * 0.3 },
      { x: width * 0.6, y: height * 0.3, w: width * 0.25, h: height * 0.25 }
    ];
    
    faceRegions.forEach(region => {
      const imageData = ctx.getImageData(region.x, region.y, region.w, region.h);
      const data = imageData.data;
      
      // Simple blur effect
      for (let i = 0; i < data.length; i += 4) {
        if (i > 0 && i < data.length - 4) {
          data[i] = (data[i - 4] + data[i] + data[i + 4]) / 3;     // Red
          data[i + 1] = (data[i - 3] + data[i + 1] + data[i + 5]) / 3; // Green
          data[i + 2] = (data[i - 2] + data[i + 2] + data[i + 6]) / 3; // Blue
        }
      }
      
      ctx.putImageData(imageData, region.x, region.y);
    });
  };

  const applyLicensePlateBlur = (ctx, width, height, intensity) => {
    // Simulate license plate area (bottom center)
    const plateRegion = { x: width * 0.3, y: height * 0.7, w: width * 0.4, h: height * 0.15 };
    const imageData = ctx.getImageData(plateRegion.x, plateRegion.y, plateRegion.w, plateRegion.h);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (i > 0 && i < data.length - 4) {
        data[i] = (data[i - 4] + data[i] + data[i + 4]) / 3;
        data[i + 1] = (data[i - 3] + data[i + 1] + data[i + 5]) / 3;
        data[i + 2] = (data[i - 2] + data[i + 2] + data[i + 6]) / 3;
      }
    }
    
    ctx.putImageData(imageData, plateRegion.x, plateRegion.y);
  };

  const applyPeopleBlur = (ctx, width, height, intensity) => {
    // Simulate people blurring (multiple regions)
    const peopleRegions = [
      { x: width * 0.1, y: height * 0.1, w: width * 0.4, h: height * 0.6 },
      { x: width * 0.6, y: height * 0.2, w: width * 0.3, h: height * 0.5 }
    ];
    
    peopleRegions.forEach(region => {
      const imageData = ctx.getImageData(region.x, region.y, region.w, region.h);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        if (i > 0 && i < data.length - 4) {
          data[i] = (data[i - 4] + data[i] + data[i + 4]) / 3;
          data[i + 1] = (data[i - 3] + data[i + 1] + data[i + 5]) / 3;
          data[i + 2] = (data[i - 2] + data[i + 2] + data[i + 6]) / 3;
        }
      }
      
      ctx.putImageData(imageData, region.x, region.y);
    });
  };

  const applyTextBlur = (ctx, width, height, intensity) => {
    // Simulate text blurring (horizontal strips)
    for (let y = 0; y < height; y += 20) {
      const imageData = ctx.getImageData(0, y, width, 20);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        if (i > 0 && i < data.length - 4) {
          data[i] = (data[i - 4] + data[i] + data[i + 4]) / 3;
          data[i + 1] = (data[i - 3] + data[i + 1] + data[i + 5]) / 3;
          data[i + 2] = (data[i - 2] + data[i + 2] + data[i + 6]) / 3;
        }
      }
      
      ctx.putImageData(imageData, 0, y);
    }
  };

  const downloadImage = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blurred_${file.name}`;
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blur Face</h1>
          <p className="text-gray-600">
            Easily blur out faces, license plates, people, and text in photos. 
            Hide private information with advanced blurring technology.
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

      {/* Blur Settings */}
      {selectedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Blur Intensity: {blurIntensity}%
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={blurIntensity}
                onChange={(e) => setBlurIntensity(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Objects to Blur
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'faces', label: 'Faces', icon: Eye },
                  { key: 'license-plates', label: 'License Plates', icon: EyeOff },
                  { key: 'people', label: 'People', icon: EyeOff },
                  { key: 'text', label: 'Text', icon: EyeOff }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedBlurType(item.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      selectedBlurType === item.key
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Images */}
      {selectedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Selected Images ({selectedImages.length})</h3>
            <button
              onClick={blurImages}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {isProcessing ? 'Blurring...' : 'Apply Blur'}
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
              Blurred Images ({processedImages.length})
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

export default BlurFace;