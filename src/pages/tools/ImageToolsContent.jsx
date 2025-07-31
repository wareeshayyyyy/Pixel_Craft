import React, { useState, useRef } from 'react';

const ImageToolsContent = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [sepia, setSepia] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target.result);
        setProcessedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = () => {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply transformations
      ctx.save();
      
      // Flip and rotate
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (flipHorizontal) ctx.scale(-1, 1);
      if (flipVertical) ctx.scale(1, -1);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      // Apply filters
      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        blur(${blur}px)
        grayscale(${grayscale ? 1 : 0})
        sepia(${sepia}%)
      `;
      
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
      
      setProcessedImage(canvas.toDataURL('image/jpeg'));
    };
    
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'edited-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setGrayscale(false);
    setSepia(0);
    setProcessedImage(originalImage);
  };

  React.useEffect(() => {
    applyFilters();
  }, [brightness, contrast, saturation, blur, rotation, flipHorizontal, flipVertical, grayscale, sepia]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Tools</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Upload and Preview */}
        <div className="w-full md:w-1/2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
            {processedImage ? (
              <img 
                src={processedImage} 
                alt="Processed" 
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Upload an image to edit</p>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Select Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>
          
          {processedImage && (
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex-1"
              >
                Download Image
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex-1"
              >
                Reset
              </button>
            </div>
          )}
        </div>
        
        {/* Editing Tools */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Editing Tools</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Brightness: {brightness}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Contrast: {contrast}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Saturation: {saturation}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Blur: {blur}px</label>
              <input
                type="range"
                min="0"
                max="10"
                value={blur}
                onChange={(e) => setBlur(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Rotation: {rotation}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Sepia: {sepia}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={sepia}
                onChange={(e) => setSepia(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={grayscale}
                  onChange={(e) => setGrayscale(e.target.checked)}
                  className="mr-2"
                />
                Grayscale
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={flipHorizontal}
                  onChange={(e) => setFlipHorizontal(e.target.checked)}
                  className="mr-2"
                />
                Flip Horizontal
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={flipVertical}
                  onChange={(e) => setFlipVertical(e.target.checked)}
                  className="mr-2"
                />
                Flip Vertical
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToolsContent;