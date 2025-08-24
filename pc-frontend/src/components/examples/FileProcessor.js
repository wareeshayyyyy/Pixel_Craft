import React, { useState } from 'react';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import { validateFile, formatFileSize, getFileType } from '../../utils/fileUtils';

const FileProcessor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [operation, setOperation] = useState('pdf-to-word');
  const [options, setOptions] = useState({});
  const { processFile, loading, error, progress, clearError } = useFileProcessor();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileType = getFileType(file.name);
      validateFile(file, fileType);
      setSelectedFile(file);
      clearError();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    try {
      await processFile(operation, selectedFile, options);
    } catch (err) {
      console.error('Processing failed:', err);
    }
  };

  const renderOptions = () => {
    if (operation === 'image-resize') {
      return (
        <div className="options">
          <input
            type="number"
            placeholder="Width"
            onChange={(e) => setOptions({...options, width: parseInt(e.target.value)})}
          />
          <input
            type="number"
            placeholder="Height"
            onChange={(e) => setOptions({...options, height: parseInt(e.target.value)})}
          />
          <label>
            <input
              type="checkbox"
              onChange={(e) => setOptions({...options, maintainAspect: e.target.checked})}
            />
            Maintain Aspect Ratio
          </label>
        </div>
      );
    }

    if (operation === 'image-convert') {
      return (
        <div className="options">
          <select onChange={(e) => setOptions({...options, format: e.target.value})}>
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WebP</option>
            <option value="gif">GIF</option>
          </select>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="file-processor" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>PixelCraft File Processor</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.bmp"
        />
        {selectedFile && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={operation} 
          onChange={(e) => setOperation(e.target.value)}
          disabled={loading}
        >
          <optgroup label="PDF Operations">
            <option value="pdf-to-word">PDF to Word</option>
            <option value="pdf-to-images">PDF to Images</option>
            <option value="pdf-extract-text">Extract Text</option>
            <option value="pdf-compress">Compress PDF</option>
            <option value="pdf-split">Split PDF</option>
          </optgroup>
          <optgroup label="Image Operations">
            <option value="image-convert">Convert Format</option>
            <option value="image-resize">Resize Image</option>
            <option value="image-remove-bg">Remove Background</option>
            <option value="image-compress">Compress Image</option>
          </optgroup>
        </select>
      </div>

      {renderOptions()}
      
      <button 
        onClick={handleProcess} 
        disabled={!selectedFile || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Processing...' : 'Process File'}
      </button>
      
      {loading && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '5px' }}>Progress: {progress}%</div>
          <div style={{ 
            width: '100%', 
            height: '10px', 
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileProcessor;
