// File validation utilities
export const validateFile = (file, type = 'any') => {
  const maxSize = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 50000000; // 50MB default
  
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${Math.round(maxSize / 1000000)}MB limit`);
  }

  const imageFormats = (process.env.REACT_APP_SUPPORTED_IMAGE_FORMATS || 'jpg,jpeg,png,webp,gif,bmp').split(',');
  const pdfFormats = (process.env.REACT_APP_SUPPORTED_PDF_FORMATS || 'pdf').split(',');

  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (type === 'image' && !imageFormats.includes(fileExtension)) {
    throw new Error(`Unsupported image format. Supported: ${imageFormats.join(', ')}`);
  }

  if (type === 'pdf' && !pdfFormats.includes(fileExtension)) {
    throw new Error(`Unsupported PDF format. Supported: ${pdfFormats.join(', ')}`);
  }

  return true;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
  const pdfFormats = ['pdf'];
  
  if (imageFormats.includes(extension)) return 'image';
  if (pdfFormats.includes(extension)) return 'pdf';
  return 'other';
};
