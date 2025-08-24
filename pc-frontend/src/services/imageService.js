import ApiService from './api';

class ImageService {
  async convertFormat(file, format, quality = 95) {
    const response = await ApiService.makeRequest(
      `/image/convert?format=${format}&quality=${quality}`,
      {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        })(),
      }
    );
    
    const filename = `${file.name.split('.')[0]}.${format}`;
    await ApiService.downloadFile(response, filename);
  }

  async resizeImage(file, width, height, maintainAspect = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('maintain_aspect', maintainAspect);

    const response = await ApiService.makeRequest('/image/resize', {
      method: 'POST',
      body: formData,
    });
    
    const filename = `resized_${file.name}`;
    await ApiService.downloadFile(response, filename);
  }

  async removeBackground(file) {
    const response = await ApiService.uploadFile('/image/remove-background', file);
    const filename = `no_bg_${file.name.split('.')[0]}.png`;
    await ApiService.downloadFile(response, filename);
  }

  async compressImage(file, quality = 85) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);

    const response = await ApiService.makeRequest('/image/compress', {
      method: 'POST',
      body: formData,
    });
    
    const filename = `compressed_${file.name.split('.')[0]}.jpg`;
    await ApiService.downloadFile(response, filename);
  }
}

export default new ImageService();
