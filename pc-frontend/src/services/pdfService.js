import ApiService from './api';

class PDFService {
  // Generic method for all PDF operations that return blobs
  async processFile(endpoint, file, additionalData = {}, settings = {}) {
    console.log('processFile called with:', { endpoint, file, additionalData, settings });
    console.log('File object:', file);
    console.log('File name:', file?.name);
    console.log('File size:', file?.size);
    console.log('File type:', file?.type);
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (settings && Object.keys(settings).length > 0) {
      formData.append('settings', JSON.stringify(settings));
    }
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    // Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await ApiService.makeRequest(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `PDF operation failed with status ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json();
            errorMessage = error.detail || error.message || error.error || errorMessage;
          } catch (jsonError) {
            console.warn('Could not parse error response as JSON:', jsonError);
          }
        }
        throw new Error(errorMessage);
      }

      return await response.blob();
    } catch (error) {
      console.error('PDF processing error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Failed to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // Generic method for multiple files
  async processMultipleFiles(endpoint, files, additionalData = {}) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    try {
      const response = await ApiService.makeRequest(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `PDF operation failed with status ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json();
            errorMessage = error.detail || error.message || error.error || errorMessage;
          } catch (jsonError) {
            console.warn('Could not parse error response as JSON:', jsonError);
          }
        }
        throw new Error(errorMessage);
      }

      return await response.blob();
    } catch (error) {
      console.error('PDF processing error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Failed to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // Specific PDF operations
  async convertToWord(file, settings = {}) {
    return await this.processFile('/api/pdf/to-word', file, {}, settings);
  }

  async convertToImages(file, format = 'png', dpi = 150) {
    return await this.processFile('/api/pdf/to-images', file, { format, dpi });
  }

  async convertToExcel(file, settings = {}) {
    return await this.processFile('/api/pdf/to-excel', file, {}, settings);
  }

  async convertToPpt(file, settings = {}) {
    return await this.processFile('/api/pdf/to-ppt', file, {}, settings);
  }

  async convertToPdfA(file, settings = {}) {
    return await this.processFile('/api/pdf/to-pdfa', file, {}, settings);
  }

  async extractText(file) {
    try {
      const response = await ApiService.makeRequest('/api/pdf/extract-text', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        })()
      });

      if (!response.ok) {
        let errorMessage = `Text extraction failed with status ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json();
            errorMessage = error.detail || error.message || error.error || errorMessage;
          } catch (jsonError) {
            console.warn('Could not parse error response as JSON:', jsonError);
          }
        }
        throw new Error(errorMessage);
      }

      return await response.text();
    } catch (error) {
      console.error('Text extraction error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Failed to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  async mergePDFs(files, settings = {}) {
    return await this.processMultipleFiles('/api/pdf/merge', files, settings);
  }

  async splitPDF(file, splitOptions = {}) {
    return await this.processFile('/api/pdf/split', file, {}, splitOptions);
  }

  async compressPDF(file, quality = 50) {
    return await this.processFile('/api/pdf/compress', file, { quality });
  }

  async protectPDF(file, protectionSettings = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_password', protectionSettings.userPassword || '');
    formData.append('owner_password', protectionSettings.ownerPassword || protectionSettings.userPassword || '');
    formData.append('encryption_level', protectionSettings.encryptionLevel || '128-bit');
    formData.append('permissions', JSON.stringify(protectionSettings.permissions || {}));

    try {
      const response = await ApiService.makeRequest('/api/pdf/protect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `PDF protection failed with status ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json();
            errorMessage = error.detail || error.message || error.error || errorMessage;
          } catch (jsonError) {
            console.warn('Could not parse error response as JSON:', jsonError);
          }
        }
        throw new Error(errorMessage);
      }

      return await response.blob();
    } catch (error) {
      console.error('PDF protection error:', error);
      if (error.message.includes('fetch')) {
        throw new Error('Failed to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  async unlockPDF(file, password = '') {
    return await this.processFile('/api/pdf/unlock', file, { password });
  }

  async rotatePDF(file, rotation = 90) {
    return await this.processFile('/api/pdf/rotate', file, { rotation });
  }

  async cropPDF(file, cropSettings = {}) {
    return await this.processFile('/api/pdf/crop', file, {}, cropSettings);
  }

  async watermarkPDF(file, watermarkSettings = {}) {
    return await this.processFile('/api/pdf/watermark', file, {}, watermarkSettings);
  }

  async signPDF(file, signatureSettings = {}) {
    return await this.processFile('/api/pdf/sign', file, {}, signatureSettings);
  }

  async redactPDF(file, redactSettings = {}) {
    return await this.processFile('/api/pdf/redact', file, {}, redactSettings);
  }

  async repairPDF(file) {
    return await this.processFile('/api/pdf/repair', file);
  }

  async organizePDF(file, organizeSettings = {}) {
    return await this.processFile('/api/pdf/organize', file, {}, organizeSettings);
  }

  async ocrPDF(file, ocrSettings = {}) {
    // Determine if file is PDF or image
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    if (isPDF) {
      // Use PDF OCR endpoint for PDF files with proper parameter mapping
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', ocrSettings.language || 'eng');
      formData.append('output_format', ocrSettings.output_format || 'searchable_pdf');
      formData.append('ocr_mode', ocrSettings.mode || 'auto');
      
      console.log('PDF OCR FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await ApiService.makeRequest('/api/pdf/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `PDF OCR failed with status ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json();
            errorMessage = error.detail || error.message || error.error || errorMessage;
          } catch (jsonError) {
            console.warn('Could not parse error response as JSON:', jsonError);
          }
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } else {
      // Use image OCR endpoint for image files
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Image OCR FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await ApiService.makeRequest('/ocr/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Image OCR failed with status ${response.status}: ${response.statusText}`;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json();
            errorMessage = error.detail || error.message || error.error || errorMessage;
          } catch (jsonError) {
            console.warn('Could not parse error response as JSON:', jsonError);
          }
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    }
  }

  async extractPages(file, pages = '') {
    return await this.processFile('/api/pdf/extract-pages', file, {}, { pages });
  }

  async removePages(file, pages = '') {
    return await this.processFile('/api/pdf/remove-pages', file, {}, { pages });
  }

  async addPageNumbers(file, numberingSettings = {}) {
    return await this.processFile('/api/pdf/add-page-numbers', file, {}, numberingSettings);
  }

  async comparePDF(file1, file2) {
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    const response = await ApiService.makeRequest('/api/pdf/compare', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Comparison failed: ${response.status}`);
    }

    return await response.blob();
  }

  // Conversion from other formats to PDF
  async wordToPDF(file, settings = {}) {
    return await this.processFile('/api/convert/word-to-pdf', file, {}, settings);
  }

  async excelToPDF(file, settings = {}) {
    return await this.processFile('/api/convert/excel-to-pdf', file, {}, settings);
  }

  async pptToPDF(file, settings = {}) {
    return await this.processFile('/api/convert/ppt-to-pdf', file, {}, settings);
  }

  async jpgToPDF(files, settings = {}) {
    return await this.processMultipleFiles('/api/convert/jpg-to-pdf', files, settings);
  }

  async htmlToPDF(htmlContent, settings = {}) {
    const response = await ApiService.makeRequest('/api/convert/html-to-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html: htmlContent, settings }),
    });

    if (!response.ok) {
      throw new Error(`HTML to PDF conversion failed: ${response.status}`);
    }

    return await response.blob();
  }

  async scanToPDF(images, settings = {}) {
    return await this.processMultipleFiles('/api/convert/scan-to-pdf', images, settings);
  }
}

const pdfService = new PDFService();
export default pdfService;
