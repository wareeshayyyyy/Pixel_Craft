// src/components/FileUpload.jsx
import React, { useCallback, useState } from 'react';

const FileUpload = ({ acceptedFormats, onFilesSelected, multiple = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  }, [onFilesSelected]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  }, [onFilesSelected]);

  return (
    <div 
      className={`p-12 text-center rounded-lg transition-all ${isDragging ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'}`}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <label className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer font-medium">
          Choose Files
          <input 
            type="file" 
            className="hidden" 
            multiple={multiple}
            onChange={handleFileChange}
            accept={acceptedFormats}
          />
        </label>
        <p className="text-sm text-gray-500">
          {acceptedFormats === 'image/*' 
            ? 'Supports: JPG, PNG, GIF, SVG' 
            : acceptedFormats}
        </p>
      </div>
    </div>
  );
};

export default FileUpload;