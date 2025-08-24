import { useState } from 'react';
import PDFService from '../services/pdfService';
import ImageService from '../services/imageService';

export const useFileProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const processFile = async (operation, file, options = {}) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      let result;
      
      // PDF Operations
      if (operation === 'pdf-to-word') {
        result = await PDFService.convertToWord(file);
      } else if (operation === 'pdf-to-images') {
        result = await PDFService.convertToImages(file, options.format, options.dpi);
      } else if (operation === 'pdf-extract-text') {
        result = await PDFService.extractText(file);
      } else if (operation === 'pdf-merge') {
        result = await PDFService.mergePDFs(file);
      } else if (operation === 'pdf-split') {
        result = await PDFService.splitPDF(file, options.pagesPerFile);
      } else if (operation === 'pdf-compress') {
        result = await PDFService.compressPDF(file, options.quality);
      }
      
      // Image Operations
      else if (operation === 'image-convert') {
        result = await ImageService.convertFormat(file, options.format, options.quality);
      } else if (operation === 'image-resize') {
        result = await ImageService.resizeImage(file, options.width, options.height, options.maintainAspect);
      } else if (operation === 'image-remove-bg') {
        result = await ImageService.removeBackground(file);
      } else if (operation === 'image-compress') {
        result = await ImageService.compressImage(file, options.quality);
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    processFile,
    loading,
    error,
    progress,
    clearError: () => setError(null)
  };
};
