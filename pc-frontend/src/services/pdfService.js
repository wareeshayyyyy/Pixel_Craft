import ApiService from './api';

class PDFService {
  async convertToWord(file) {
    const response = await ApiService.uploadFile('/pdf/to-word', file);
    const filename = `${file.name.split('.')[0]}.docx`;
    await ApiService.downloadFile(response, filename);
  }

  async convertToImages(file, format = 'png', dpi = 150) {
    const response = await ApiService.makeRequest(
      `/pdf/to-images?format=${format}&dpi=${dpi}`,
      {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        })(),
      }
    );
    
    const filename = `${file.name.split('.')[0]}_images.zip`;
    await ApiService.downloadFile(response, filename);
  }

  async extractText(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await ApiService.makeRequest('/pdf/extract-text', {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  }

  async mergePDFs(files) {
    const response = await ApiService.uploadMultipleFiles('/pdf/merge', files);
    await ApiService.downloadFile(response, 'merged.pdf');
  }

  async splitPDF(file, pagesPerFile = 1) {
    const response = await ApiService.uploadFile('/pdf/split', file, {
      pages_per_file: pagesPerFile
    });
    
    const filename = `${file.name.split('.')[0]}_split.zip`;
    await ApiService.downloadFile(response, filename);
  }

  async compressPDF(file, quality = 50) {
    const response = await ApiService.uploadFile('/pdf/compress', file, {
      quality
    });
    
    const filename = `compressed_${file.name}`;
    await ApiService.downloadFile(response, filename);
  }
}

export default new PDFService();
