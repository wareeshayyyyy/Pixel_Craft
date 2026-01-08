import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X, Type, Image as ImageIcon } from 'lucide-react';

const WatermarkImage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedImages, setWatermarkedImages] = useState([]);
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [position, setPosition] = useState('bottom-right');
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    setFiles(imageFiles);
    setWatermarkedImages([]);
  }, []);

  const handleWatermarkImageSelect = useCallback((selectedFiles) => {
    const imageFile = selectedFiles[0];
    if (imageFile && imageFile.type.startsWith('image/')) {
      setWatermarkImage(imageFile);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const addWatermarks = async () => {
    if (files.length === 0) return;
    if (watermarkType === 'text' && !watermarkText.trim()) return;
    if (watermarkType === 'image' && !watermarkImage) return;

    setIsProcessing(true);
    const watermarked = [];

    for (const file of files) {
      try {
        const watermarkedImage = await addWatermarkToImage(
          file, 
          watermarkType, 
          watermarkText, 
          watermarkImage, 
          position, 
          opacity, 
          fontSize, 
          fontColor, 
          fontFamily
        );
        watermarked.push(watermarkedImage);
      } catch (error) {
        console.error('Watermarking failed for:', file.name, error);
      }
    }

    setWatermarkedImages(watermarked);
    setIsProcessing(false);
  };

  const addWatermarkToImage = (file, type, text, watermarkImg, pos, alpha, size, color, font) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (type === 'text') {
          addTextWatermark(ctx, text, pos, alpha, size, color, font, canvas.width, canvas.height);
        } else if (type === 'image' && watermarkImg) {
          const watermarkElement = new Image();
          watermarkElement.onload = () => {
            addImageWatermark(ctx, watermarkElement, pos, alpha, canvas.width, canvas.height);
            finalizeWatermark();
          };
          watermarkElement.src = URL.createObjectURL(watermarkImg);
          return;
        }

        finalizeWatermark();

        function finalizeWatermark() {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const watermarkedFileName = file.name.replace(/(\.[^.]+)$/, '_watermarked$1');
                const watermarkedFile = new File([blob], watermarkedFileName, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(watermarkedFile);
              } else {
                reject(new Error('Watermarking failed'));
              }
            },
            file.type,
            0.9
          );
        }
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const addTextWatermark = (ctx, text, position, alpha, fontSize, color, fontFamily, canvasWidth, canvasHeight) => {
    ctx.save();
    ctx.globalAlpha = alpha / 100;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.strokeStyle = color === '#ffffff' ? '#000000' : '#ffffff';
    ctx.lineWidth = 1;

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    let x, y;
    const padding = 20;

    switch (position) {
      case 'top-left':
        x = padding;
        y = textHeight + padding;
        break;
      case 'top-center':
        x = (canvasWidth - textWidth) / 2;
        y = textHeight + padding;
        break;
      case 'top-right':
        x = canvasWidth - textWidth - padding;
        y = textHeight + padding;
        break;
      case 'center-left':
        x = padding;
        y = (canvasHeight + textHeight) / 2;
        break;
      case 'center':
        x = (canvasWidth - textWidth) / 2;
        y = (canvasHeight + textHeight) / 2;
        break;
      case 'center-right':
        x = canvasWidth - textWidth - padding;
        y = (canvasHeight + textHeight) / 2;
        break;
      case 'bottom-left':
        x = padding;
        y = canvasHeight - padding;
        break;
      case 'bottom-center':
        x = (canvasWidth - textWidth) / 2;
        y = canvasHeight - padding;
        break;
      case 'bottom-right':
      default:
        x = canvasWidth - textWidth - padding;
        y = canvasHeight - padding;
        break;
    }

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  const addImageWatermark = (ctx, watermarkImg, position, alpha, canvasWidth, canvasHeight) => {
    ctx.save();
    ctx.globalAlpha = alpha / 100;

    const maxWatermarkSize = Math.min(canvasWidth, canvasHeight) * 0.25;
    const aspectRatio = watermarkImg.width / watermarkImg.height;
    
    let watermarkWidth, watermarkHeight;
    if (aspectRatio > 1) {
      watermarkWidth = maxWatermarkSize;
      watermarkHeight = maxWatermarkSize / aspectRatio;
    } else {
      watermarkHeight = maxWatermarkSize;
      watermarkWidth = maxWatermarkSize * aspectRatio;
    }

    let x, y;
    const padding = 20;

    switch (position) {
      case 'top-left':
        x = padding;
        y = padding;
        break;
      case 'top-center':
        x = (canvasWidth - watermarkWidth) / 2;
        y = padding;
        break;
      case 'top-right':
        x = canvasWidth - watermarkWidth - padding;
        y = padding;
        break;
      case 'center-left':
        x = padding;
        y = (canvasHeight - watermarkHeight) / 2;
        break;
      case 'center':
        x = (canvasWidth - watermarkWidth) / 2;
        y = (canvasHeight - watermarkHeight) / 2;
        break;
      case 'center-right':
        x = canvasWidth - watermarkWidth - padding;
        y = (canvasHeight - watermarkHeight) / 2;
        break;
      case 'bottom-left':
        x = padding;
        y = canvasHeight - watermarkHeight - padding;
        break;
      case 'bottom-center':
        x = (canvasWidth - watermarkWidth) / 2;
        y = canvasHeight - watermarkHeight - padding;
        break;
      case 'bottom-right':
      default:
        x = canvasWidth - watermarkWidth - padding;
        y = canvasHeight - watermarkHeight - padding;
        break;
    }

    ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
    ctx.restore();
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
    watermarkedImages.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (watermarkedImages.length > 0) {
      const newWatermarked = watermarkedImages.filter((_, i) => i !== index);
      setWatermarkedImages(newWatermarked);
    }
  };

  const positionOptions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'center-left', label: 'Center Left' },
    { value: 'center', label: 'Center' },
    { value: 'center-right', label: 'Center Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Add Watermark to Images</h1>
        <p className="text-lg text-gray-600 mb-8">
          Add text or image watermarks to your photos. Protect your images with 
          customizable watermarks in various positions and styles.
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

        {/* Watermark Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Watermark Settings</h3>
            
            {/* Watermark Type */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Watermark Type</label>
              <div className="flex gap-4">
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="text"
                    checked={watermarkType === 'text'}
                    onChange={(e) => setWatermarkType(e.target.value)}
                    className="mr-3"
                  />
                  <Type className="w-5 h-5 mr-2" />
                  <span>Text Watermark</span>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="image"
                    checked={watermarkType === 'image'}
                    onChange={(e) => setWatermarkType(e.target.value)}
                    className="mr-3"
                  />
                  <ImageIcon className="w-5 h-5 mr-2" />
                  <span>Image Watermark</span>
                </label>
              </div>
            </div>

            {/* Text Watermark Settings */}
            {watermarkType === 'text' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter watermark text"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Courier New">Courier New</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="100"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Font Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-12 h-8 rounded border cursor-pointer"
                      />
                      <div className="flex space-x-1">
                        {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'].map(color => (
                          <button
                            key={color}
                            onClick={() => setFontColor(color)}
                            className={`w-6 h-6 rounded border ${fontColor === color ? 'border-red-500 border-2' : 'border-gray-300'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Watermark Settings */}
            {watermarkType === 'image' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-gray-700 mb-2">Watermark Image</label>
                <FileUpload 
                  acceptedFormats="image/*" 
                  onFilesSelected={handleWatermarkImageSelect}
                  multiple={false}
                />
                {watermarkImage && (
                  <div className="mt-3 text-sm text-green-600">
                    Selected: {watermarkImage.name}
                  </div>
                )}
              </div>
            )}

            {/* Position and Opacity Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {positionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Opacity: {opacity}%</label>
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
          </div>
        )}

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
              <button
                onClick={addWatermarks}
                disabled={isProcessing || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !watermarkImage)}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Type className="w-4 h-4" />
                <span>{isProcessing ? 'Adding Watermarks...' : 'Add Watermarks'}</span>
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

        {/* Watermarked Images */}
        {watermarkedImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Watermarked Images ({watermarkedImages.length})
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
              {watermarkedImages.map((file, index) => (
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

export default WatermarkImage;