// DownloadButton.jsx - Reusable Download Button Component
import React, { useState } from 'react';

const DownloadButton = ({ 
  onDownload, 
  disabled = false, 
  isProcessing = false,
  fileName = "processed_file",
  fileExtension = "pdf",
  downloadUrl = null,
  downloadData = null,
  file = null, // new: accept file prop for compatibility
  className = "",
  children = null,
  variant = "primary" // primary, secondary, success
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Normalize `file` prop into downloadUrl/downloadData/fileName/fileExtension
  if (file) {
    try {
      if (file instanceof Blob) {
        downloadData = downloadData || file;
        // file.name doesn't exist on Blob; keep provided fileName
      } else if (typeof file === 'object') {
        // Possible shapes: { url, name, data, blob }
        if (file.url) downloadUrl = downloadUrl || file.url;
        if (file.data) downloadData = downloadData || file.data;
        if (file.blob) downloadData = downloadData || file.blob;
        if (file.name) fileName = file.name.replace(/\.[^.]+$/, '') || fileName;
        if (file.name && file.name.includes('.')) {
          const parts = file.name.split('.');
          fileExtension = parts[parts.length - 1];
        }
      }
    } catch (err) {
      console.warn('DownloadButton: failed to normalize `file` prop', err);
    }
  }

  const handleDownload = async () => {
    if (disabled || isProcessing || isDownloading) return;

    setIsDownloading(true);
    
    try {
      if (downloadUrl) {
        // Download from URL
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${fileName}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (downloadData) {
        // Download from data (blob, base64, etc.)
        const blob = downloadData instanceof Blob ? downloadData : new Blob([downloadData]);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (onDownload) {
        // Custom download handler
        await onDownload();
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500", 
      success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
    };

    return `${baseStyles} ${variants[variant]} ${className}`;
  };

  const isButtonDisabled = disabled || isProcessing || isDownloading;

  return (
    <button
      onClick={handleDownload}
      disabled={isButtonDisabled}
      className={getButtonStyles()}
      title={isButtonDisabled ? "Processing..." : `Download ${fileName}.${fileExtension}`}
    >
      {/* Download Icon */}
      <svg 
        className={`w-5 h-5 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {isDownloading ? (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        ) : (
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        )}
      </svg>
      
      {/* Button Text */}
      {children || (
        <>
          {isDownloading ? 'Downloading...' : 
           isProcessing ? 'Processing...' : 
           `Download ${fileExtension.toUpperCase()}`}
        </>
      )}
    </button>
  );
};

// Export variations for common use cases
export const DownloadPdfButton = (props) => (
  <DownloadButton {...props} fileExtension="pdf" variant="primary" />
);

export const DownloadImageButton = (props) => (
  <DownloadButton {...props} fileExtension="jpg" variant="secondary" />
);

export const DownloadExcelButton = (props) => (
  <DownloadButton {...props} fileExtension="xlsx" variant="success" />
);

export const DownloadWordButton = (props) => (
  <DownloadButton {...props} fileExtension="docx" variant="primary" />
);

export const DownloadZipButton = (props) => (
  <DownloadButton {...props} fileExtension="zip" variant="secondary" />
);

export default DownloadButton;