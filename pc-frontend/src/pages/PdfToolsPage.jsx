import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  // Document Icons
  FaFileAlt as FiFileText,
  FaFile as FiFile,
  FaFileWord as FiFileWord,
  FaFileImage as FiFileImage,
  FaFilePdf as FiFilePdf,
  
  // Action Icons
  FaRandom as FiMerge,
  FaCut as FiScissors,
  FaCompress as FiCompress,
  FaEdit as FiEdit,
  FaPen as FiPenTool,
  FaSearch as FiSearch,
  FaRedo as FiRotateCw,
  FaCrop as FiCrop,
  FaCopy as FiCopy,
  FaTrashAlt as FiTrash2,
  
  // Security Icons
  FaLock as FiLock,
  FaUnlock as FiUnlock,
  FaEyeSlash as FiEyeOff,
  
  // Organization Icons
  FaLayerGroup as FiOrganize,
  FaHashtag as FiHash,
  
  // Tool Icons
  FaTools as FiTool,
  FaFileUpload as FiScan,
  FaBalanceScale as FiCompare,
  
  // Conversion Icons
  FaGlobe as FiGlobe,
  
  // Special Aliases
  FaFileWord as FiWordToPdf,
  FaFileImage as FiJpgToPdf,
  FaCode as FiHtmlToPdf
} from 'react-icons/fa';

const PdfToolsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All PDF Tools' },
    { id: 'organize', name: 'Organize' },
    { id: 'optimize', name: 'Optimize' },
    { id: 'convert', name: 'Convert' },
    { id: 'edit', name: 'Edit' },
    { id: 'security', name: 'Security' }
  ];

  const allTools = [
    // Organize Tools
    {
      id: 1,
      name: 'Merge PDF',
      description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
      path: '/tools/merge-pdf',
      icon: <FiMerge className="text-blue-500" size={24} />,
      category: 'organize'
    },
    {
      id: 2,
      name: 'Split PDF',
      description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      path: '/tools/split-pdf',
      icon: <FiScissors className="text-red-500" size={24} />,
      category: 'organize'
    },
    {
      id: 3,
      name: 'Organize PDF',
      description: 'Sort pages of your PDF file however you like. Delete or add pages to your document.',
      path: '/tools/organize-pdf',
      icon: <FiOrganize className="text-purple-500" size={24} />,
      category: 'organize'
    },
    {
      id: 16,
      name: 'Rotate PDF',
      description: 'Rotate PDF pages to the correct orientation in just a few clicks.',
      path: '/tools/rotate-pdf',
      icon: <FiRotateCw className="text-green-500" size={24} />,
      category: 'organize'
    },
    {
      id: 20,
      name: 'Extract Pages',
      description: 'Select and extract specific pages from your PDF document.',
      path: '/tools/extract-pages',
      icon: <FiCopy className="text-blue-500" size={24} />,
      category: 'organize'
    },
    {
      id: 31,
      name: 'Remove Pages',
      description: 'Delete specific pages from your PDF document.',
      path: '/tools/remove-pages',
      icon: <FiTrash2 className="text-red-500" size={24} />,
      category: 'organize'
    },
    
    // Optimize Tools
    {
      id: 4,
      name: 'Compress PDF',
      description: 'Reduce file size while optimizing for maximal PDF quality.',
      path: '/tools/compress-pdf',
      icon: <FiCompress className="text-orange-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 5,
      name: 'Repair PDF',
      description: 'Repair a damaged PDF and recover data from corrupt PDF files.',
      path: '/tools/repair-pdf',
      icon: <FiTool className="text-yellow-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 13,
      name: 'OCR PDF',
      description: 'Easily convert scanned PDF into searchable and selectable documents.',
      path: '/tools/ocr-pdf',
      icon: <FiSearch className="text-indigo-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 22,
      name: 'Flatten PDF',
      description: 'Flatten annotations and form fields into the PDF content.',
      path: '/tools/flatten-pdf',
      icon: <FiFilePdf className="text-gray-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 34,
      name: 'Scan to PDF',
      description: 'Convert scanned documents to searchable PDF files.',
      path: '/tools/scan-to-pdf',
      icon: <FiScan className="text-green-500" size={24} />,
      category: 'optimize'
    },
    
    // Convert Tools
    {
      id: 6,
      name: 'PDF to Word',
      description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
      path: '/tools/pdf-to-word',
      icon: <FiFileWord className="text-blue-600" size={24} />,
      category: 'convert'
    },
    {
      id: 7,
      name: 'Word to PDF',
      description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
      path: '/tools/word-to-pdf',
      icon: <FiWordToPdf className="text-blue-600" size={24} />,
      category: 'convert'
    },
    {
      id: 8,
      name: 'PDF to JPG',
      description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
      path: '/tools/pdf-to-jpg',
      icon: <FiFileImage className="text-pink-500" size={24} />,
      category: 'convert'
    },
    {
      id: 19,
      name: 'PDF to PDF/A',
      description: 'Convert your PDF to PDF/A format for long-term archiving.',
      path: '/tools/pdf-to-pdfa',
      icon: <FiFilePdf className="text-gray-600" size={24} />,
      category: 'convert'
    },
    {
      id: 24,
      name: 'PDF to Excel',
      description: 'Extract tables from PDF and convert them to Excel spreadsheets.',
      path: '/tools/pdf-to-excel',
      icon: <FiFileText className="text-green-600" size={24} />,
      category: 'convert'
    },
    {
      id: 25,
      name: 'Excel to PDF',
      description: 'Convert Excel files to PDF format for easy sharing and printing.',
      path: '/tools/excel-to-pdf',
      icon: <FiFileText className="text-green-600" size={24} />,
      category: 'convert'
    },
    {
      id: 26,
      name: 'PDF to PowerPoint',
      description: 'Convert PDF files to editable PowerPoint presentations.',
      path: '/tools/pdf-to-ppt',
      icon: <FiFile className="text-orange-600" size={24} />,
      category: 'convert'
    },
    {
      id: 27,
      name: 'PowerPoint to PDF',
      description: 'Convert PowerPoint presentations to PDF documents.',
      path: '/tools/ppt-to-pdf',
      icon: <FiFile className="text-orange-600" size={24} />,
      category: 'convert'
    },
    {
      id: 29,
      name: 'PDF to HTML',
      description: 'Convert PDF documents to HTML web pages.',
      path: '/tools/pdf-to-html',
      icon: <FiGlobe className="text-purple-600" size={24} />,
      category: 'convert'
    },
    {
      id: 30,
      name: 'HTML to PDF',
      description: 'Convert web pages to PDF documents for offline reading.',
      path: '/tools/html-to-pdf',
      icon: <FiHtmlToPdf className="text-purple-600" size={24} />,
      category: 'convert'
    },
    {
      id: 37,
      name: 'Images to PDF',
      description: 'Convert JPG/PNG images to PDF documents.',
      path: '/tools/jpg-to-pdf',
      icon: <FiJpgToPdf className="text-pink-500" size={24} />,
      category: 'convert'
    },
    {
      id: 38,
      name: 'Webpage to PDF',
      description: 'Convert HTML web pages or URLs to PDF documents.',
      path: '/tools/webpage-to-pdf',
      icon: <FiGlobe className="text-orange-500" size={24} />,
      category: 'convert'
    },

    
    // Edit Tools
    {
      id: 9,
      name: 'Edit PDF',
      description: 'Add text, images, shapes or freehand annotations to a PDF document.',
      path: '/tools/edit-pdf',
      icon: <FiEdit className="text-blue-500" size={24} />,
      category: 'edit'
    },
    {
      id: 10,
      name: 'Watermark PDF',
      description: 'Stamp an image or text over your PDF in seconds.',
      path: '/tools/watermark-pdf',
      icon: <FiFileImage className="text-cyan-500" size={24} />,
      category: 'edit'
    },
    {
      id: 14,
      name: 'Sign PDF',
      description: 'Sign yourself or request electronic signatures from others.',
      path: '/tools/sign-pdf',
      icon: <FiPenTool className="text-green-600" size={24} />,
      category: 'edit'
    },
    {
      id: 18,
      name: 'Compare PDF',
      description: 'Find differences between two PDF files with our comparison tool.',
      path: '/tools/compare-pdf',
      icon: <FiCompare className="text-purple-500" size={24} />,
      category: 'edit'
    },
    {
      id: 21,
      name: 'Workflow',
      description: 'Create custom workflows with your favorite tools, automate tasks.',
      path: '/tools/workflow',
      icon: <FiTool className="text-purple-600" size={24} />,
      category: 'edit'
    },
    {
      id: 35,
      name: 'Add Page Numbers',
      description: 'Add page numbers to your PDF document with custom formatting.',
      path: '/tools/add-page-numbers',
      icon: <FiHash className="text-yellow-500" size={24} />,
      category: 'edit'
    },
    {
      id: 23,
      name: 'PDF Metadata Editor',
      description: 'Edit title, author, and other metadata of your PDF files.',
      path: '/tools/pdf-metadata',
      icon: <FiEdit className="text-indigo-500" size={24} />,
      category: 'edit'
    },
    {
      id: 28,
      name: 'PDF Forms',
      description: 'Create fillable PDF forms or extract data from existing forms.',
      path: '/tools/pdf-forms',
      icon: <FiFileText className="text-teal-500" size={24} />,
      category: 'edit'
    },

    {
      id: 36,
      name: 'Crop PDF',
      description: 'Adjust margins and crop PDF pages to your preferred size.',
      path: '/tools/crop-pdf',
      icon: <FiCrop className="text-indigo-500" size={24} />,
      category: 'edit'
    },
    
    // Security Tools
    {
      id: 11,
      name: 'Protect PDF',
      description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
      path: '/tools/protect-pdf',
      icon: <FiLock className="text-red-600" size={24} />,
      category: 'security'
    },
    {
      id: 12,
      name: 'Unlock PDF',
      description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
      path: '/tools/unlock-pdf',
      icon: <FiUnlock className="text-green-600" size={24} />,
      category: 'security'
    },
    {
      id: 17,
      name: 'Redact PDF',
      description: 'Permanently remove sensitive information from your PDF documents.',
      path: '/tools/redact-pdf',
      icon: <FiEyeOff className="text-gray-600" size={24} />,
      category: 'security'
    },

    
    // Special Tools
    {
      id: 15,
      name: 'Create Workflow',
      description: 'Create custom workflows with your favorite tools, automate tasks.',
      path: '/tools/workflow',
      icon: <FiTool className="text-purple-600" size={24} />,
      category: 'all'
    },
    
    // Additional PDF Tools
    {
      id: 39,
      name: 'PDF to Text',
      description: 'Extract plain text from PDF documents for easy editing.',
      path: '/tools/pdf-to-text',
      icon: <FiFileText className="text-gray-600" size={24} />,
      category: 'convert'
    },

  ];

  const filteredTools = activeCategory === 'all'
    ? allTools
    : allTools.filter(tool => tool.category === activeCategory);

  const CategoryNav = ({ categories, activeCategory, setActiveCategory }) => (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeCategory === category.id
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );

  const HeroSection = () => (
    <section className="bg-gradient-to-r from-red-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Every PDF tool you'll ever need in one place
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Edit, convert, compress, merge, split, and more – all for free!
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center text-center border border-gray-200 group"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-block bg-gradient-to-r from-pink-100 via-red-100 to-yellow-100 rounded-full px-8 py-4 border border-pink-200 shadow-sm">
              <p className="text-lg font-semibold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                  Showing {filteredTools.length} of {allTools.length} PDF tools
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Our PDF Tools?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Process PDF documents in seconds with our optimized algorithms and powerful servers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-3">100% Secure</h3>
              <p className="text-gray-600">Your PDF files are processed securely and automatically deleted after processing</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold mb-3">High Quality</h3>
              <p className="text-gray-600">Professional-grade PDF processing with advanced algorithms and document preservation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Supported Document Formats</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'JPG', 'PNG', 'HTML'].map((format) => (
                <span
                  key={format}
                  className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PdfToolsPage;