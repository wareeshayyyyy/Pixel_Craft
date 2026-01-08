import React, { useState, useCallback } from 'react';
import { Upload, Download, X, Grid3x3, Grid2x2, Columns, Rows, Shuffle, Palette, Settings, Image as ImageIcon, CheckCircle } from 'lucide-react';

const CollageMaker = () => {
  const [files, setFiles] = useState([]);
  const [layout, setLayout] = useState('grid-2x2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCollages, setProcessedCollages] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [borderWidth, setBorderWidth] = useState(10);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [cornerRadius, setCornerRadius] = useState(0);
  const [spacing, setSpacing] = useState(10);
  const [outputFormat, setOutputFormat] = useState('png');
  const [outputQuality, setOutputQuality] = useState('high');
  const [collageSize, setCollageSize] = useState('large');

  const handleFileSelect = useCallback((selectedFiles) => {
    if (!selectedFiles) return;
    
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
    );
    
    setFiles(prev => [...prev, ...imageFiles]);
    setProcessedCollages([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Get collage dimensions based on size setting
  const getCollageDimensions = () => {
    const dimensions = {
      small: { width: 800, height: 600 },
      medium: { width: 1200, height: 900 },
      large: { width: 1920, height: 1440 },
      xl: { width: 2400, height: 1800 },
      square: { width: 1200, height: 1200 },
      social: { width: 1200, height: 630 }
    };
    return dimensions[collageSize] || dimensions.large;
  };

  // Get layout configuration
  const getLayoutConfig = (layoutType, imageCount) => {
    const configs = {
      'grid-2x2': { cols: 2, rows: 2, maxImages: 4 },
      'grid-3x3': { cols: 3, rows: 3, maxImages: 9 },
      'grid-4x4': { cols: 4, rows: 4, maxImages: 16 },
      'horizontal': { cols: Math.min(imageCount, 6), rows: 1, maxImages: 6 },
      'vertical': { cols: 1, rows: Math.min(imageCount, 6), maxImages: 6 },
      'mosaic': { cols: 3, rows: 2, maxImages: 6 },
      'magazine': { cols: 2, rows: 3, maxImages: 6 },
      'polaroid': { cols: 2, rows: 2, maxImages: 4 }
    };
    return configs[layoutType] || configs['grid-2x2'];
  };

  // Generate multiple collage variations
  const createCollages = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const collages = [];
    
    try {
      // Create main collage
      const mainCollage = await generateCollage(files, layout, 'main');
      collages.push(mainCollage);

      // Create variations if we have enough images
      if (files.length >= 4) {
        const layouts = ['grid-2x2', 'grid-3x3', 'mosaic', 'magazine'];
        for (const layoutType of layouts) {
          if (layoutType !== layout) {
            const variation = await generateCollage(files, layoutType, `variation_${layoutType}`);
            collages.push(variation);
          }
        }
      }

      setProcessedCollages(collages);
    } catch (error) {
      console.error('Collage creation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCollage = async (images, layoutType, variant) => {
    return new Promise(async (resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const dimensions = getCollageDimensions();
      const layoutConfig = getLayoutConfig(layoutType, images.length);
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cellWidth = (canvas.width - (layoutConfig.cols - 1) * spacing) / layoutConfig.cols;
      const cellHeight = (canvas.height - (layoutConfig.rows - 1) * spacing) / layoutConfig.rows;

      let loadedImages = 0;
      const imageElements = [];
      const imagesToUse = images.slice(0, layoutConfig.maxImages);

      // Load all images
      const loadPromises = imagesToUse.map((file, index) => {
        return new Promise((imgResolve, imgReject) => {
          const img = new Image();
          img.onload = () => {
            imageElements[index] = img;
            loadedImages++;
            imgResolve(img);
          };
          img.onerror = () => imgReject(new Error('Image load failed'));
          img.src = URL.createObjectURL(file);
        });
      });

      try {
        await Promise.all(loadPromises);

        // Draw images based on layout
        imageElements.forEach((img, index) => {
          if (index >= layoutConfig.maxImages) return;

          const col = index % layoutConfig.cols;
          const row = Math.floor(index / layoutConfig.cols);
          
          let x = col * (cellWidth + spacing);
          let y = row * (cellHeight + spacing);
          let width = cellWidth;
          let height = cellHeight;

          // Special layouts
          if (layoutType === 'mosaic' && index === 0) {
            // First image takes 2x2 space
            width = cellWidth * 2 + spacing;
            height = cellHeight * 2 + spacing;
          } else if (layoutType === 'magazine') {
            // Featured image layout
            if (index === 0) {
              width = cellWidth * 1.5;
              height = cellHeight * 2;
            } else {
              x = cellWidth * 1.5 + spacing + (index - 1) * (cellWidth * 0.5 + spacing);
              y = Math.floor((index - 1) / 2) * (cellHeight + spacing);
              width = cellWidth * 0.5;
            }
          }

          // Apply border
          if (borderWidth > 0) {
            ctx.fillStyle = borderColor;
            ctx.fillRect(x - borderWidth/2, y - borderWidth/2, width + borderWidth, height + borderWidth);
          }

          // Save context for clipping
          ctx.save();

          // Apply corner radius
          if (cornerRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, cornerRadius);
            ctx.clip();
          }

          // Calculate aspect ratio fit
          const imgAspect = img.width / img.height;
          const cellAspect = width / height;
          
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspect > cellAspect) {
            // Image is wider
            drawHeight = height;
            drawWidth = height * imgAspect;
            drawX = x - (drawWidth - width) / 2;
            drawY = y;
          } else {
            // Image is taller
            drawWidth = width;
            drawHeight = width / imgAspect;
            drawX = x;
            drawY = y - (drawHeight - height) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();

          // Clean up object URL
          URL.revokeObjectURL(img.src);
        });

        // Add text overlay if it's a variation
        if (variant !== 'main') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(10, 10, 200, 40);
          ctx.fillStyle = 'white';
          ctx.font = '16px Arial';
          ctx.fillText(`${layoutType.toUpperCase()} Layout`, 20, 35);
        }

        // Convert to blob
        const quality = outputQuality === 'high' ? 0.95 : outputQuality === 'medium' ? 0.8 : 0.6;
        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = `collage_${layoutType}_${Date.now()}.${outputFormat}`;
            const collageFile = new File([blob], fileName, {
              type: `image/${outputFormat}`,
              lastModified: Date.now(),
            });
            
            resolve({
              file: collageFile,
              layout: layoutType,
              variant,
              dimensions: `${canvas.width}x${canvas.height}`,
              size: (blob.size / 1024 / 1024).toFixed(2),
              imageCount: imagesToUse.length,
              timestamp: new Date().toLocaleString()
            });
          } else {
            reject(new Error('Collage creation failed'));
          }
        }, `image/${outputFormat}`, quality);

      } catch (error) {
        reject(error);
      }
    });
  };

  // Download single collage
  const downloadCollage = (collageData) => {
    const url = URL.createObjectURL(collageData.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = collageData.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download all collages
  const downloadAll = () => {
    processedCollages.forEach((collageData, index) => {
      setTimeout(() => downloadCollage(collageData), index * 200);
    });
  };

  // Remove image
  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (processedCollages.length > 0) {
      setProcessedCollages([]);
    }
  };

  // Clear all
  const clearAll = () => {
    setFiles([]);
    setProcessedCollages([]);
  };

  // Layout options with icons
  const layoutOptions = [
    { value: 'grid-2x2', label: '2×2 Grid', icon: Grid2x2, maxImages: 4 },
    { value: 'grid-3x3', label: '3×3 Grid', icon: Grid3x3, maxImages: 9 },
    { value: 'grid-4x4', label: '4×4 Grid', icon: Grid3x3, maxImages: 16 },
    { value: 'horizontal', label: 'Horizontal', icon: Columns, maxImages: 6 },
    { value: 'vertical', label: 'Vertical', icon: Rows, maxImages: 6 },
    { value: 'mosaic', label: 'Mosaic', icon: Shuffle, maxImages: 6 },
    { value: 'magazine', label: 'Magazine', icon: ImageIcon, maxImages: 6 },
    { value: 'polaroid', label: 'Polaroid', icon: Grid2x2, maxImages: 4 }
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Collage Maker</h1>
          <p className="text-gray-600">
            Combine multiple photos into beautiful collages. Choose from various layouts, customize design, and download multiple variations.
          </p>
        </div>
        
        {/* File Upload Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div
            className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-16 h-16 text-red-400" />
              <h3 className="text-xl font-semibold text-gray-700">Add Photos</h3>
              <p className="text-gray-500">or drop images here</p>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Choose Images
              </label>
              
              <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF, WebP (Multiple files)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Panel */}
          <div className="w-full lg:w-1/3">
            {files.length > 0 && (
              <div className="space-y-6">
                {/* Layout Options */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Grid3x3 className="w-5 h-5 mr-2" />
                    Layout Options
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {layoutOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setLayout(option.value)}
                          disabled={files.length < 2}
                          className={`p-3 border rounded-lg text-sm flex flex-col items-center space-y-1 transition-colors
                            ${layout === option.value 
                              ? 'bg-red-500 text-white border-red-500' 
                              : files.length >= 2 
                                ? 'bg-white hover:bg-gray-50 border-gray-300' 
                                : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{option.label}</span>
                          <span className="text-xs opacity-75">
                            Max {option.maxImages}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Design Settings */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Design Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Background Color</label>
                      <div className="flex space-x-2 mb-2">
                        {['#ffffff', '#f3f4f6', '#000000', '#fef2f2', '#f0f9ff', '#f0fdf4'].map(color => (
                          <button
                            key={color}
                            onClick={() => setBackgroundColor(color)}
                            className={`w-8 h-8 rounded-full border-2 ${backgroundColor === color ? 'border-red-500' : 'border-gray-300'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full h-8 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Spacing: {spacing}px</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={spacing}
                        onChange={(e) => setSpacing(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Border Width: {borderWidth}px</label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Corner Radius: {cornerRadius}px</label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={cornerRadius}
                        onChange={(e) => setCornerRadius(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Settings */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Output Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Collage Size</label>
                      <select
                        value={collageSize}
                        onChange={(e) => setCollageSize(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="small">Small (800×600)</option>
                        <option value="medium">Medium (1200×900)</option>
                        <option value="large">Large (1920×1440)</option>
                        <option value="xl">Extra Large (2400×1800)</option>
                        <option value="square">Square (1200×1200)</option>
                        <option value="social">Social Media (1200×630)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Output Format</label>
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="png">PNG (Best Quality)</option>
                        <option value="jpeg">JPEG (Smaller Size)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Quality</label>
                      <select
                        value={outputQuality}
                        onChange={(e) => setOutputQuality(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="high">High (95%)</option>
                        <option value="medium">Medium (80%)</option>
                        <option value="low">Low (60%)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Selected Images */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Images ({files.length})</h3>
                    <button
                      onClick={clearAll}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded relative">
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="text-sm truncate pr-6">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Preview Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-100 rounded-lg p-6 min-h-96">
              {processedCollages.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-green-600">
                      Generated Collages ({processedCollages.length})
                    </h3>
                    <button
                      onClick={downloadAll}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download All ({processedCollages.length})</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {processedCollages.map((collageData, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow">
                        <img 
                          src={URL.createObjectURL(collageData.file)} 
                          alt={`Collage ${collageData.layout}`}
                          className="w-full h-48 object-cover rounded mb-3"
                        />
                        <div className="text-sm text-gray-600 mb-2">
                          <div className="font-medium">{collageData.layout.toUpperCase()}</div>
                          <div>{collageData.dimensions} • {collageData.size} MB</div>
                          <div>{collageData.imageCount} images</div>
                        </div>
                        <button
                          onClick={() => downloadCollage(collageData)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors flex items-center justify-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : files.length > 0 ? (
                <div className="text-center">
                  <div className={`grid gap-4 mb-6 
                    ${layout === 'grid-2x2' ? 'grid-cols-2' : ''}
                    ${layout === 'grid-3x3' ? 'grid-cols-3' : ''}
                    ${layout === 'horizontal' ? 'grid-flow-col auto-cols-fr' : ''}
                    ${layout === 'vertical' ? 'grid-cols-1' : ''}
                    ${(layout === 'mosaic' || layout === 'magazine') ? 'grid-cols-2' : ''}
                  `}>
                    {files.slice(0, getLayoutConfig(layout, files.length).maxImages).map((file, index) => (
                      <div key={index} className="bg-white p-2 rounded overflow-hidden">
                        <img 
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={createCollages}
                    disabled={isProcessing || files.length < 2}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-8 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Creating Collages...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        <span>Create Multiple Collages</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                  <ImageIcon className="w-16 h-16 mb-4 text-gray-400" />
                  <p className="text-lg">Your collage preview will appear here</p>
                  <p className="text-sm">Upload 2 or more images to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">How to create collages:</h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>• Upload 2 or more images (supports JPG, PNG, GIF, WebP)</li>
            <li>• Choose your preferred layout (Grid, Mosaic, Magazine, etc.)</li>
            <li>• Customize design with colors, spacing, borders, and effects</li>
            <li>• Select output size and quality settings</li>
            <li>• Click "Create Multiple Collages" to generate various layouts</li>
            <li>• Download individual collages or all at once</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-blue-800 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <strong>Pro tip:</strong> The system will automatically create multiple layout variations 
              for you to choose from, giving you more design options!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollageMaker;