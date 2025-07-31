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
  FaRandom as FiShuffle,
  FaList as FiList,
  FaColumns as FiColumns,
  FaHashtag as FiHash,
  
  // Tool Icons
  FaTools as FiTool,
  FaFileUpload as FiScan,
  FaCamera as FiCamera,
  FaBalanceScale as FiCompare,
  FaPrint as FiPrinter,
  
  // Conversion Icons
  FaGlobe as FiGlobe,
  FaCode as FiCode,
  FaImage as FiImage,
  
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
      path: '/tools/pdf/merge',
      icon: <FiMerge className="text-blue-500" size={24} />,
      category: 'organize'
    },
    {
      id: 2,
      name: 'Split PDF',
      description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
      path: '/tools/pdf/split',
      icon: <FiScissors className="text-red-500" size={24} />,
      category: 'organize'
    },
    {
      id: 3,
      name: 'Organize PDF',
      description: 'Sort pages of your PDF file however you like. Delete or add pages to your document.',
      path: '/tools/pdf/organize',
      icon: <FiOrganize className="text-purple-500" size={24} />,
      category: 'organize'
    },
    {
      id: 16,
      name: 'Rotate PDF',
      description: 'Rotate PDF pages to the correct orientation in just a few clicks.',
      path: '/tools/pdf/rotate',
      icon: <FiRotateCw className="text-green-500" size={24} />,
      category: 'organize'
    },
    {
      id: 20,
      name: 'Extract Pages',
      description: 'Select and extract specific pages from your PDF document.',
      path: '/tools/pdf/extract',
      icon: <FiCopy className="text-blue-500" size={24} />,
      category: 'organize'
    },
    {
      id: 31,
      name: 'Remove Pages',
      description: 'Delete specific pages from your PDF document.',
      path: '/tools/pdf/remove-pages',
      icon: <FiTrash2 className="text-red-500" size={24} />,
      category: 'organize'
    },
    
    // Optimize Tools
    {
      id: 4,
      name: 'Compress PDF',
      description: 'Reduce file size while optimizing for maximal PDF quality.',
      path: '/tools/pdf/compress',
      icon: <FiCompress className="text-orange-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 5,
      name: 'Repair PDF',
      description: 'Repair a damaged PDF and recover data from corrupt PDF files.',
      path: '/tools/pdf/repair',
      icon: <FiTool className="text-yellow-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 13,
      name: 'OCR PDF',
      description: 'Easily convert scanned PDF into searchable and selectable documents.',
      path: '/tools/pdf/ocr',
      icon: <FiSearch className="text-indigo-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 22,
      name: 'Flatten PDF',
      description: 'Flatten annotations and form fields into the PDF content.',
      path: '/tools/pdf/flatten',
      icon: <FiFilePdf className="text-gray-500" size={24} />,
      category: 'optimize'
    },
    {
      id: 34,
      name: 'Scan to PDF',
      description: 'Convert scanned documents to searchable PDF files.',
      path: '/tools/pdf/scan-to-pdf',
      icon: <FiScan className="text-green-500" size={24} />,
      category: 'optimize'
    },
    
    // Convert Tools
    {
      id: 6,
      name: 'PDF to Word',
      description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
      path: '/tools/pdf/to-word',
      icon: <FiFileWord className="text-blue-600" size={24} />,
      category: 'convert'
    },
    {
      id: 7,
      name: 'Word to PDF',
      description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
      path: '/tools/pdf/from-word',
      icon: <FiWordToPdf className="text-blue-600" size={24} />,
      category: 'convert'
    },
    {
      id: 8,
      name: 'PDF to JPG',
      description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
      path: '/tools/pdf/to-jpg',
      icon: <FiFileImage className="text-pink-500" size={24} />,
      category: 'convert'
    },
    {
      id: 19,
      name: 'PDF to PDF/A',
      description: 'Convert your PDF to PDF/A format for long-term archiving.',
      path: '/tools/pdf/to-pdfa',
      icon: <FiFilePdf className="text-gray-600" size={24} />,
      category: 'convert'
    },
    {
      id: 24,
      name: 'PDF to Excel',
      description: 'Extract tables from PDF and convert them to Excel spreadsheets.',
      path: '/tools/pdf/to-excel',
      icon: <FiFileText className="text-green-600" size={24} />,
      category: 'convert'
    },
    {
      id: 25,
      name: 'Excel to PDF',
      description: 'Convert Excel files to PDF format for easy sharing and printing.',
      path: '/tools/pdf/from-excel',
      icon: <FiFileText className="text-green-600" size={24} />,
      category: 'convert'
    },
    {
      id: 26,
      name: 'PDF to PowerPoint',
      description: 'Convert PDF files to editable PowerPoint presentations.',
      path: '/tools/pdf/to-ppt',
      icon: <FiFile className="text-orange-600" size={24} />,
      category: 'convert'
    },
    {
      id: 27,
      name: 'PowerPoint to PDF',
      description: 'Convert PowerPoint presentations to PDF documents.',
      path: '/tools/pdf/from-ppt',
      icon: <FiFile className="text-orange-600" size={24} />,
      category: 'convert'
    },
    {
      id: 29,
      name: 'PDF to HTML',
      description: 'Convert PDF documents to HTML web pages.',
      path: '/tools/pdf/to-html',
      icon: <FiGlobe className="text-purple-600" size={24} />,
      category: 'convert'
    },
    {
      id: 30,
      name: 'HTML to PDF',
      description: 'Convert web pages to PDF documents for offline reading.',
      path: '/tools/pdf/from-html',
      icon: <FiHtmlToPdf className="text-purple-600" size={24} />,
      category: 'convert'
    },
    {
      id: 37,
      name: 'Images to PDF',
      description: 'Convert JPG/PNG images to PDF documents.',
      path: '/tools/pdf/images-to-pdf',
      icon: <FiJpgToPdf className="text-pink-500" size={24} />,
      category: 'convert'
    },
    {
      id: 38,
      name: 'Webpage to PDF',
      description: 'Convert HTML web pages or URLs to PDF documents.',
      path: '/tools/pdf/webpage-to-pdf',
      icon: <FiGlobe className="text-orange-500" size={24} />,
      category: 'convert'
    },
    {
      id: 39,
      name: 'Word to PDF',
      description: 'Convert DOC/DOCX files to PDF format.',
      path: '/tools/pdf/word-to-pdf',
      icon: <FiFileWord className="text-teal-500" size={24} />,
      category: 'convert'
    },
    
    // Edit Tools
    {
      id: 9,
      name: 'Edit PDF',
      description: 'Add text, images, shapes or freehand annotations to a PDF document.',
      path: '/tools/pdf/edit',
      icon: <FiEdit className="text-blue-500" size={24} />,
      category: 'edit'
    },
    {
      id: 10,
      name: 'Watermark PDF',
      description: 'Stamp an image or text over your PDF in seconds.',
      path: '/tools/pdf/watermark',
      icon: <FiFileImage className="text-cyan-500" size={24} />,
      category: 'edit'
    },
    {
      id: 14,
      name: 'Sign PDF',
      description: 'Sign yourself or request electronic signatures from others.',
      path: '/tools/pdf/sign',
      icon: <FiPenTool className="text-green-600" size={24} />,
      category: 'edit'
    },
    {
      id: 18,
      name: 'Compare PDF',
      description: 'Find differences between two PDF files with our comparison tool.',
      path: '/tools/pdf/compare',
      icon: <FiCompare className="text-purple-500" size={24} />,
      category: 'edit'
    },
    {
      id: 21,
      name: 'Number Pages',
      description: 'Add page numbers to your PDF document with custom formatting.',
      path: '/tools/pdf/number',
      icon: <FiHash className="text-yellow-500" size={24} />,
      category: 'edit'
    },
    {
      id: 23,
      name: 'PDF Metadata Editor',
      description: 'Edit title, author, and other metadata of your PDF files.',
      path: '/tools/pdf/metadata',
      icon: <FiEdit className="text-indigo-500" size={24} />,
      category: 'edit'
    },
    {
      id: 28,
      name: 'PDF Forms',
      description: 'Create fillable PDF forms or extract data from existing forms.',
      path: '/tools/pdf/forms',
      icon: <FiFileText className="text-teal-500" size={24} />,
      category: 'edit'
    },
    {
      id: 35,
      name: 'Add Page Numbers',
      description: 'Insert page numbers to your PDF document with custom formatting.',
      path: '/tools/pdf/add-page-numbers',
      icon: <FiHash className="text-yellow-500" size={24} />,
      category: 'edit'
    },
    {
      id: 36,
      name: 'Crop PDF',
      description: 'Adjust margins and crop PDF pages to your preferred size.',
      path: '/tools/pdf/crop-pdf',
      icon: <FiCrop className="text-indigo-500" size={24} />,
      category: 'edit'
    },
    
    // Security Tools
    {
      id: 11,
      name: 'Protect PDF',
      description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
      path: '/tools/pdf/protect',
      icon: <FiLock className="text-red-600" size={24} />,
      category: 'security'
    },
    {
      id: 12,
      name: 'Unlock PDF',
      description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
      path: '/tools/pdf/unlock',
      icon: <FiUnlock className="text-green-600" size={24} />,
      category: 'security'
    },
    {
      id: 17,
      name: 'Redact PDF',
      description: 'Permanently remove sensitive information from your PDF documents.',
      path: '/tools/pdf/redact',
      icon: <FiEyeOff className="text-gray-600" size={24} />,
      category: 'security'
    },
    
    // Special Tools
    {
      id: 15,
      name: 'Create Workflow',
      description: 'Create custom workflows with your favorite tools, automate tasks.',
      path: '/tools/pdf/workflow',
      icon: <FiTool className="text-purple-600" size={24} />,
      category: 'all'
    }
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
    <section className="bg-gradient-to-br from-red-500 to-pink-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Every PDF tool you'll ever need
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Edit, convert, compress, merge, split, rotate, sort and more – all in one place
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-lg">
            Choose from {allTools.length} powerful PDF tools or upload your file to get started
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <CategoryNav 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          
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
            <p className="text-gray-600 text-lg">
              Showing {filteredTools.length} of {allTools.length} PDF tools
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PdfToolsPage;