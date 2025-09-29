# PixelCraft✨

<div align="center">
  <h3>A Powerful All-in-One Image & PDF Editing Toolbox</h3>
  <p>Fast, intuitive, and powerful web application for all your document and image manipulation needs</p>
  
  [![GitHub stars](https://img.shields.io/github/stars/wareeshayyyyy/Pixel_Craft)](https://github.com/wareeshayyyyy/Pixel_Craft/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/wareeshayyyyy/Pixel_Craft)](https://github.com/wareeshayyyyy/Pixel_Craft/network)
  [![GitHub issues](https://img.shields.io/github/issues/wareeshayyyyy/Pixel_Craft)](https://github.com/wareeshayyyyy/Pixel_Craft/issues)
  [![License](https://img.shields.io/github/license/wareeshayyyyy/Pixel_Craft)](https://github.com/wareeshayyyyy/Pixel_Craft/blob/main/LICENSE)
</div>

## 🎯 Overview

PixelCraft Pro is a feature-rich web application designed to handle all your image and PDF manipulation needs with ease. Whether you're a developer, designer, or just someone who frequently works with files, PixelCraft Pro provides a fast, intuitive, and powerful way to edit, convert, and optimize your documents and images.

## ✨ Features

### 📄 PDF Operations
#### Convert PDFs
- **PDF to Word** 📄→📝 - Convert PDFs to editable Word documents
- **PDF to Excel** 📄→📊 - Extract data into Excel spreadsheets
- **PDF to PowerPoint** 📄→🎤 - Transform PDFs to presentation slides
- **PDF to Images** 📄→🖼️ - Convert PDF pages to image formats
- **PDF to Text** 📄→📋 - Extract plain text from PDFs
- **Multiple formats to PDF** 🔄 - Convert Word/Excel/PPT/HTML/JPG to PDF

#### Edit & Modify PDFs
- **Merge PDFs** ➕ - Combine multiple PDFs into one
- **Split PDFs** ✂️ - Split large PDFs into smaller files
- **Compress PDFs** 📦 - Reduce file size while maintaining quality
- **Rotate PDFs** 🔄 - Rotate pages to correct orientation
- **Add Watermarks** 💧 - Brand your documents with custom watermarks
- **Protect/Unlock PDFs** 🔒🔓 - Add or remove password protection
- **Redact Content** 🚫 - Remove sensitive information permanently
- **Add Page Numbers** 🔢 - Insert custom page numbering
- **OCR Support** 🔍 - Extract text from scanned PDFs

#### PDF Optimization
- **Repair Corrupt PDFs** 🛠️ - Fix damaged or corrupted PDF files
- **PDF/A Conversion** 🏛️ - Convert to archival standard format
- **Remove Pages** ❌ - Delete unwanted pages
- **Extract Pages** ✨ - Save specific pages as new documents
- **Crop PDFs** ✂️ - Remove unwanted margins and content
- **Organize Pages** 🔄 - Reorder pages as needed

### 🖼️ Image Operations
#### Convert Images
- **Format Conversion** - JPG ↔ PNG ↔ WEBP ↔ SVG ↔ GIF
- **Bulk Processing** 🔄 - Convert multiple images simultaneously

#### Edit & Enhance Images
- **Resize & Crop** 🖼️ - Adjust image dimensions and composition
- **Compress Images** 📦 - Reduce file size without quality loss
- **Color Adjustments** ✨ - Modify brightness, contrast, and saturation
- **Filters & Effects** 🌈 - Apply artistic filters and enhancements
- **Background Removal** 🧹 - AI-powered background removal
- **Text & Watermarks** 💧 - Add custom text and branding

### 🚀 Advanced Features
- **Image to PDF** 🖼️→📄 - Convert single or multiple images to PDF
- **Scan to PDF** 📸→🔍 - OCR support for scanned documents
- **Batch Processing** ⚡ - Edit multiple files simultaneously
- **Real-time Preview** 👁️ - See changes before applying
- **Cloud Integration** ☁️ - Save and sync across devices

## 🛠️ Tech Stack

### Frontend
- **React.js** ⚛️ - Modern UI with Hooks & Context API
- **Tailwind CSS** 🎨 - Beautiful, responsive design system
- **PDF-lib / PDF.js** - Advanced PDF manipulation
- **Canvas API / Sharp** - High-performance image processing
- **Tesseract.js** - Client-side OCR capabilities

### Backend 
Python FastAPI

### Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Heroku
- **CDN**: CloudFlare for global performance

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/wareeshayyyyy/Pixel_Craft.git
cd Pixel_Craft
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Start Development Server
```bash
# Using npm
npm start

# Using yarn
yarn start
```

### 4. Build for Production
```bash
# Using npm
npm run build

# Using yarn
yarn build
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Pixel_Craft/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── PDF/
│   │   ├── Image/
│   │   └── Common/
│   ├── utils/
│   ├── hooks/
│   ├── context/
│   ├── styles/
│   └── App.js
├── package.json
└── README.md
```

## 🎨 Usage Examples

### Converting PDF to Word
```javascript
// Example code snippet for PDF to Word conversion
import { pdfToWord } from './utils/pdfConverter';

const convertFile = async (pdfFile) => {
  try {
    const wordFile = await pdfToWord(pdfFile);
    // Handle the converted file
  } catch (error) {
    console.error('Conversion failed:', error);
  }
};
```

### Image Batch Processing
```javascript
// Example for batch image processing
import { batchResize } from './utils/imageProcessor';

const processImages = async (imageFiles, options) => {
  const processedImages = await batchResize(imageFiles, {
    width: 800,
    height: 600,
    quality: 0.8
  });
  return processedImages;
};
```

## 🤝 Contributing

We love contributions! Here's how you can help make PixelCraft Pro even better:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. **Make your changes and commit**
   ```bash
   git commit -m 'Add awesome feature'
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/awesome-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Test your changes thoroughly

## 🐛 Bug Reports & Feature Requests

- **Bug Reports**: [Create an Issue](https://github.com/wareeshayyyyy/Pixel_Craft/issues/new)
- **Feature Requests**: [Create an Issue](https://github.com/wareeshayyyyy/Pixel_Craft/issues/new) 

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/wareeshayyyyy/Pixel_Craft/blob/main/LICENSE) file for details.

## 👨‍💻 Author

**Wareesh**
- GitHub: [@wareeshayyyyy](https://github.com/wareeshayyyyy)
- Email: f223441@cfd.nu.edu.pk

## 🌟 Why Choose PixelCraft Pro?

✅ **All-in-One Solution** – No need for multiple tools!  
✅ **Fast & Secure** – Processes files in your browser (no server uploads unless needed)  
✅ **User-Friendly** – Clean, modern UI with intuitive controls  
✅ **Free & Open-Source** – No hidden costs or limitations!  
✅ **Cross-Platform** – Works on any device with a web browser  
✅ **Privacy-Focused** – Your files stay on your device  

## 📊 Performance

- ⚡ Lightning-fast processing with Web Workers
- 🔒 Client-side processing for maximum privacy
- 📱 Responsive design for all screen sizes
- 🌐 Progressive Web App (PWA) support
- ⏱️ Real-time progress tracking

## 🔮 Roadmap

- [ ] Advanced image filters and effects
- [ ] Collaborative editing features
- [ ] API for developers
- [ ] Mobile app versions
- [ ] Advanced OCR with multiple languages
- [ ] Integration with cloud storage providers

## 💝 Support the Project

If you find PixelCraft Pro helpful, please consider:
- ⭐ Starring the repository on GitHub
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🔄 Sharing with others who might find it useful

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/wareeshayyyyy">Wareesha</a></p>
  <p>🌟 <strong>Star this repo if you found it helpful!</strong> 🌟</p>
</div>
