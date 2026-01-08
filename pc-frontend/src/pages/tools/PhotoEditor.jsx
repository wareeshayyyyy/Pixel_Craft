import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X, Edit, Sliders } from 'lucide-react';

const PhotoEditor = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImages, setEditedImages] = useState([]);
  
  // Image adjustment settings
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [invert, setInvert] = useState(0);
  const [opacity, setOpacity] = useState(100);

  // Filter presets
  const filterPresets = [
    { name: 'Original', brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 0, invert: 0 },
    { name: 'Vintage', brightness: 10, contrast: 20, saturation: -20, hue: 10, blur: 0, sepia: 30, grayscale: 0, invert: 0 },
    { name: 'Black & White', brightness: 0, contrast: 10, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100, invert: 0 },
    { name: 'Bright', brightness: 30, contrast: 15, saturation: 20, hue: 0, blur: 0, sepia: 0, grayscale: 0, invert: 0 },
    { name: 'Dark', brightness: -20, contrast: 25, saturation: -10, hue: 0, blur: 0, sepia: 0, grayscale: 0, invert: 0 },
    { name: 'Warm', brightness: 15, contrast: 10, saturation: 25, hue: 15, blur: 0, sepia: 15, grayscale: 0, invert: 0 },
    { name: 'Cool', brightness: 5, contrast: 10, saturation: 15, hue: -10, blur: 0, sepia: 0, grayscale: 0, invert: 0 },
    { name: 'Blur', brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 3, sepia: 0, grayscale: 0, invert: 0 }
  ];

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    setFiles(imageFiles);
    setEditedImages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const applyEdits = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const edited = [];

    for (const file of files) {
      try {
        const editedImage = await editImage(file, {
          brightness,
          contrast,
          saturation,
          hue,
          blur,
          sepia,
          grayscale,
          invert,
          opacity
        });
        edited.push(editedImage);
      } catch (error) {
        console.error('Image editing failed for:', file.name, error);
      }
    }

    setEditedImages(edited);
    setIsProcessing(false);
  };

  const editImage = (file, settings) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply CSS filters to canvas context
        const filterString = buildFilterString(settings);
        ctx.filter = filterString;
        ctx.globalAlpha = settings.opacity / 100;

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const editedFileName = file.name.replace(/(\.[^.]+)$/, '_edited$1');
              const editedFile = new File([blob], editedFileName, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(editedFile);
            } else {
              reject(new Error('Image editing failed'));
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

  const buildFilterString = (settings) => {
    const filters = [];
    
    if (settings.brightness !== 0) {
      filters.push(`brightness(${(100 + settings.brightness)}%)`);
    }
    if (settings.contrast !== 0) {
      filters.push(`contrast(${(100 + settings.contrast)}%)`);
    }
    if (settings.saturation !== 0) {
      filters.push(`saturate(${(100 + settings.saturation)}%)`);
    }
    if (settings.hue !== 0) {
      filters.push(`hue-rotate(${settings.hue}deg)`);
    }
    if (settings.blur > 0) {
      filters.push(`blur(${settings.blur}px)`);
    }
    if (settings.sepia > 0) {
      filters.push(`sepia(${settings.sepia}%)`);
    }
    if (settings.grayscale > 0) {
      filters.push(`grayscale(${settings.grayscale}%)`);
    }
    if (settings.invert > 0) {
      filters.push(`invert(${settings.invert}%)`);
    }

    return filters.length > 0 ? filters.join(' ') : 'none';
  };

  const applyPreset = (preset) => {
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setHue(preset.hue);
    setBlur(preset.blur);
    setSepia(preset.sepia);
    setGrayscale(preset.grayscale);
    setInvert(preset.invert);
  };

  const resetSettings = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setHue(0);
    setBlur(0);
    setSepia(0);
    setGrayscale(0);
    setInvert(0);
    setOpacity(100);
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
    editedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (editedImages.length > 0) {
      const newEdited = editedImages.filter((_, i) => i !== index);
      setEditedImages(newEdited);
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-4">Photo Editor</h1>
        <p className="text-lg text-gray-600 mb-8">
          Edit your photos with professional filters and adjustments. 
          Apply brightness, contrast, saturation, and various effects.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            {files.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sliders className="w-5 h-5 mr-2" />
                  Photo Adjustments
                </h3>

                {/* Filter Presets */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-3">Quick Filters</label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic Adjustments */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Brightness: {brightness > 0 ? '+' : ''}{brightness}
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Contrast: {contrast > 0 ? '+' : ''}{contrast}
                    </label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Saturation: {saturation > 0 ? '+' : ''}{saturation}
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Hue: {hue}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={hue}
                      onChange={(e) => setHue(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Effects */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Blur: {blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Sepia: {sepia}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sepia}
                      onChange={(e) => setSepia(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Grayscale: {grayscale}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={grayscale}
                      onChange={(e) => setGrayscale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Invert: {invert}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={invert}
                      onChange={(e) => setInvert(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Opacity: {opacity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={resetSettings}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={applyEdits}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{isProcessing ? 'Applying...' : 'Apply Edits'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Selected Files */}
            {files.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
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

                {/* Live Preview */}
                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-3">Live Preview (First Image)</h4>
                    <div className="border rounded-lg p-4 bg-gray-50 flex justify-center">
                      <img
                        src={URL.createObjectURL(files[0])}
                        alt="Preview"
                        className="max-w-full max-h-64 object-contain rounded"
                        style={{
                          filter: buildFilterString({
                            brightness,
                            contrast,
                            saturation,
                            hue,
                            blur,
                            sepia,
                            grayscale,
                            invert
                          }),
                          opacity: opacity / 100
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edited Images */}
            {editedImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-green-600">
                    Edited Images ({editedImages.length})
                  </h3>
                  <button
                    onClick={downloadAll}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editedImages.map((file, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="text-sm truncate font-medium mb-2">{file.name}</div>
                      <div className="text-xs text-gray-500 mb-3">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <button
                        onClick={() => downloadImage(file)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded transition-colors"
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
      </div>
    </div>
  );
};

export default PhotoEditor;