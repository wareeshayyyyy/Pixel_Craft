import React, { useState, useCallback } from 'react';
import FileUpload from '../../components/FileUpload';
import { Upload, Download, X, Smile, Type } from 'lucide-react';

const MemeGenerator = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedMemes, setGeneratedMemes] = useState([]);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(40);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [textAlignment, setTextAlignment] = useState('center');
  const [topTextY, setTopTextY] = useState(15);
  const [bottomTextY, setBottomTextY] = useState(85);

  // Popular meme templates
  const memeTemplates = [
    { name: 'Drake Pointing', topText: 'Old thing', bottomText: 'New thing' },
    { name: 'Distracted Boyfriend', topText: 'Me', bottomText: 'New technology' },
    { name: 'This is Fine', topText: 'Everything is fine', bottomText: 'This is fine' },
    { name: 'Expanding Brain', topText: 'Small brain', bottomText: 'Galaxy brain' },
    { name: 'Change My Mind', topText: '', bottomText: 'Change my mind' },
  ];

  const handleFileSelect = useCallback((selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
    );
    setFiles(imageFiles);
    setGeneratedMemes([]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const generateMemes = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const memes = [];

    for (const file of files) {
      try {
        const memeImage = await createMeme(
          file,
          topText,
          bottomText,
          fontSize,
          fontColor,
          strokeColor,
          strokeWidth,
          fontFamily,
          textAlignment,
          topTextY,
          bottomTextY
        );
        memes.push(memeImage);
      } catch (error) {
        console.error('Meme generation failed for:', file.name, error);
      }
    }

    setGeneratedMemes(memes);
    setIsProcessing(false);
  };

  const createMeme = (file, topTxt, bottomTxt, size, color, stroke, strokeW, font, align, topY, bottomY) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the base image
        ctx.drawImage(img, 0, 0);

        // Configure text styles
        ctx.font = `bold ${size}px ${font}`;
        ctx.fillStyle = color;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeW;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';

        // Text positioning
        let textX;
        switch (align) {
          case 'left':
            textX = 20;
            break;
          case 'right':
            textX = canvas.width - 20;
            break;
          case 'center':
          default:
            textX = canvas.width / 2;
            break;
        }

        // Draw top text
        if (topTxt.trim()) {
          const topTextLines = wrapText(ctx, topTxt.toUpperCase(), canvas.width - 40);
          const topStartY = (canvas.height * (topY / 100)) - ((topTextLines.length - 1) * size * 0.6);
          
          topTextLines.forEach((line, index) => {
            const y = topStartY + (index * size * 1.2);
            ctx.strokeText(line, textX, y);
            ctx.fillText(line, textX, y);
          });
        }

        // Draw bottom text
        if (bottomTxt.trim()) {
          const bottomTextLines = wrapText(ctx, bottomTxt.toUpperCase(), canvas.width - 40);
          const bottomStartY = (canvas.height * (bottomY / 100)) - ((bottomTextLines.length - 1) * size * 0.6);
          
          bottomTextLines.forEach((line, index) => {
            const y = bottomStartY + (index * size * 1.2);
            ctx.strokeText(line, textX, y);
            ctx.fillText(line, textX, y);
          });
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const memeFileName = file.name.replace(/(\.[^.]+)$/, '_meme$1');
              const memeFile = new File([blob], memeFileName, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(memeFile);
            } else {
              reject(new Error('Meme generation failed'));
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

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
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
    generatedMemes.forEach(downloadImage);
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (generatedMemes.length > 0) {
      const newMemes = generatedMemes.filter((_, i) => i !== index);
      setGeneratedMemes(newMemes);
    }
  };

  const applyTemplate = (template) => {
    setTopText(template.topText);
    setBottomText(template.bottomText);
  };

  const fontOptions = [
    'Impact',
    'Arial Black',
    'Helvetica',
    'Arial',
    'Comic Sans MS',
    'Times New Roman',
    'Courier New'
  ];

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Meme Generator</h1>
        <p className="text-lg text-gray-600 mb-8">
          Create hilarious memes from your images. Add top and bottom text with 
          customizable fonts, colors, and styling options.
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

        {/* Meme Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Meme Settings</h3>
            
            {/* Quick Templates */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {memeTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Top Text</label>
                <textarea
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="w-full p-3 border rounded resize-none"
                  rows="3"
                  placeholder="Enter top text"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Bottom Text</label>
                <textarea
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="w-full p-3 border rounded resize-none"
                  rows="3"
                  placeholder="Enter bottom text"
                />
              </div>
            </div>

            {/* Font Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="16"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Text Alignment</label>
                <select
                  value={textAlignment}
                  onChange={(e) => setTextAlignment(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            {/* Color Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Text Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-12 h-8 rounded border cursor-pointer"
                  />
                  <div className="flex space-x-1">
                    {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map(color => (
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
              <div>
                <label className="block text-gray-700 mb-2">Outline Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-12 h-8 rounded border cursor-pointer"
                  />
                  <div className="flex space-x-1">
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'].map(color => (
                      <button
                        key={color}
                        onClick={() => setStrokeColor(color)}
                        className={`w-6 h-6 rounded border ${strokeColor === color ? 'border-red-500 border-2' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Outline Width: {strokeWidth}px</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Position Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Top Text Position: {topTextY}%</label>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={topTextY}
                  onChange={(e) => setTopTextY(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Bottom Text Position: {bottomTextY}%</label>
                <input
                  type="range"
                  min="55"
                  max="95"
                  value={bottomTextY}
                  onChange={(e) => setBottomTextY(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Preview Text */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Preview:</strong>
              <div style={{ 
                fontFamily: fontFamily, 
                color: fontColor, 
                textShadow: `2px 2px 0 ${strokeColor}, -2px -2px 0 ${strokeColor}, 2px -2px 0 ${strokeColor}, -2px 2px 0 ${strokeColor}`,
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: textAlignment 
              }}>
                {topText && <div>{topText.toUpperCase()}</div>}
                {bottomText && <div>{bottomText.toUpperCase()}</div>}
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
                onClick={generateMemes}
                disabled={isProcessing || (!topText.trim() && !bottomText.trim())}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Smile className="w-4 h-4" />
                <span>{isProcessing ? 'Generating Memes...' : 'Generate Memes'}</span>
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

        {/* Generated Memes */}
        {generatedMemes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">
                Generated Memes ({generatedMemes.length})
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
              {generatedMemes.map((file, index) => (
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

export default MemeGenerator;