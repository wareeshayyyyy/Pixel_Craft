import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Scissors, 
  Copy, 
  FileDown,
  Lock,
  Unlock,
  RotateCw,
  Type,
  Image,
  FilePlus,
  FileMinus,
  FileStack,
  Search,
  Edit,
  FileSignature,
  Settings,
  FileSpreadsheet,
  Film,
  Clipboard,
  Globe,
  Trash2,
  Camera,
  Hash,
  Crop,
  EyeOff
} from 'lucide-react';

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
      {
        id: 1,
        name: 'Merge PDF',
        description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
        path: '/tools/pdf/merge',
        icon: <FileStack className="w-8 h-8" />,
        color: 'bg-blue-500',
        category: 'organize'
      },
      {
        id: 2,
        name: 'Split PDF',
        description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
        path: '/tools/pdf/split',
        icon: <Scissors className="w-8 h-8" />,
        color: 'bg-purple-500',
        category: 'organize'
      },
      {
        id: 3,
        name: 'Organize PDF',
        description: 'Sort pages of your PDF file however you like. Delete or add pages to your document.',
        path: '/tools/pdf/organize',
        icon: <FileText className="w-8 h-8" />,
        color: 'bg-indigo-500',
        category: 'organize'
      },
      
      
      {
        id: 4,
        name: 'Compress PDF',
        description: 'Reduce file size while optimizing for maximal PDF quality.',
        path: '/tools/pdf/compress',
        icon: <FileMinus className="w-8 h-8" />,
        color: 'bg-orange-500',
        category: 'optimize'
      },
      {
        id: 5,
        name: 'Repair PDF',
        description: 'Repair a damaged PDF and recover data from corrupt PDF files.',
        path: '/tools/pdf/repair',
        icon: <Settings className="w-8 h-8" />,
        color: 'bg-yellow-500',
        category: 'optimize'
      },
      {
        id: 6,
        name: 'PDF to Word',
        description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
        path: '/tools/pdf/to-word',
        icon: <FileText className="w-8 h-8" />,
        color: 'bg-blue-600',
        category: 'convert'
      },
      {
        id: 7,
        name: 'Word to PDF',
        description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
        path: '/tools/pdf/from-word',
        icon: <FileDown className="w-8 h-8" />,
        color: 'bg-red-500',
        category: 'convert'
      },
      {
        id: 8,
        name: 'PDF to JPG',
        description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
        path: '/tools/pdf/to-jpg',
        icon: <Image className="w-8 h-8" />,
        color: 'bg-pink-500',
        category: 'convert'
      },
      {
        id: 9,
        name: 'Edit PDF',
        description: 'Add text, images, shapes or freehand annotations to a PDF document.',
        path: '/tools/pdf/edit',
        icon: <Edit className="w-8 h-8" />,
        color: 'bg-indigo-500',
        category: 'edit'
      },
      {
        id: 10,
        name: 'Watermark PDF',
        description: 'Stamp an image or text over your PDF in seconds.',
        path: '/tools/pdf/watermark',
        icon: <Type className="w-8 h-8" />,
        color: 'bg-amber-500',
        category: 'edit'
      },
      {
        id: 11,
        name: 'Protect PDF',
        description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
        path: '/tools/pdf/protect',
        icon: <Lock className="w-8 h-8" />,
        color: 'bg-rose-500',
        category: 'security'
      },
      {
        id: 12,
        name: 'Unlock PDF',
        description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
        path: '/tools/pdf/unlock',
        icon: <Unlock className="w-8 h-8" />,
        color: 'bg-green-500',
        category: 'security'
      },
      {
        id: 13,
        name: 'OCR PDF',
        description: 'Easily convert scanned PDF into searchable and selectable documents.',
        path: '/tools/pdf/ocr',
        icon: <Search className="w-8 h-8" />,
        color: 'bg-yellow-500',
        category: 'optimize'
      },
      {
        id: 14,
        name: 'Sign PDF',
        description: 'Sign yourself or request electronic signatures from others.',
        path: '/tools/pdf/sign',
        icon: <FileSignature className="w-8 h-8" />,
        color: 'bg-cyan-500',
        category: 'edit'
      },
      {
        id: 15,
        name: 'Create Workflow',
        description: 'Create custom workflows with your favorite tools, automate tasks.',
        path: '/tools/pdf/workflow',
        icon: <Settings className="w-8 h-8" />,
        color: 'bg-gray-500',
        category: 'all'
      },
      {
        id: 16,
        name: 'Rotate PDF',
        description: 'Rotate PDF pages to the correct orientation in just a few clicks.',
        path: '/tools/pdf/rotate',
        icon: <RotateCw className="w-8 h-8" />,
        color: 'bg-sky-500',
        category: 'organize'
      },
      {
        id: 17,
        name: 'Redact PDF',
        description: 'Permanently remove sensitive information from your PDF documents.',
        path: '/tools/pdf/redact',
        icon: <EyeOff className="w-8 h-8" />,
        color: 'bg-gray-700',
        category: 'security'
      },
      {
        id: 18,
        name: 'Compare PDF',
        description: 'Find differences between two PDF files with our comparison tool.',
        path: '/tools/pdf/compare',
        icon: <Search className="w-8 h-8" />,
        color: 'bg-indigo-400',
        category: 'edit'
      },
      {
        id: 19,
        name: 'PDF to PDF/A',
        description: 'Convert your PDF to PDF/A format for long-term archiving.',
        path: '/tools/pdf/to-pdfa',
        icon: <FileText className="w-8 h-8" />,
        color: 'bg-amber-700',
        category: 'convert'
      },
      {
        id: 20,
        name: 'Extract Pages',
        description: 'Select and extract specific pages from your PDF document.',
        path: '/tools/pdf/extract',
        icon: <Scissors className="w-8 h-8" />,
        color: 'bg-emerald-500',
        category: 'organize'
      },
      {
        id: 21,
        name: 'Workflow',
        description: 'Create custom workflows with your favorite tools, automate tasks.',
        path: '/tools/workflow',
        icon: <Settings className="w-8 h-8" />,
        color: 'bg-purple-500',
        category: 'edit'
      },
      {
        id: 35,
        name: 'Add Page Numbers',
        description: 'Add page numbers to your PDF document with custom formatting.',
        path: '/tools/add-page-numbers',
        icon: <Hash className="w-8 h-8" />,
        color: 'bg-yellow-500',
        category: 'edit'
      },
      {
        id: 22,
        name: 'Flatten PDF',
        description: 'Flatten annotations and form fields into the PDF content.',
        path: '/tools/pdf/flatten',
        icon: <RotateCw className="w-8 h-8" />,
        color: 'bg-violet-500',
        category: 'optimize'
      },
      {
        id: 23,
        name: 'PDF Metadata Editor',
        description: 'Edit title, author, and other metadata of your PDF files.',
        path: '/tools/pdf/metadata',
        icon: <FileText className="w-8 h-8" />,
        color: 'bg-slate-500',
        category: 'edit'
      },
      {
        id: 24,
        name: 'PDF to Excel',
        description: 'Extract tables from PDF and convert them to Excel spreadsheets.',
        path: '/tools/pdf/to-excel',
        icon: <FileSpreadsheet className="w-8 h-8" />,
        color: 'bg-teal-500',
        category: 'convert'
      },
      {
        id: 25,
        name: 'Excel to PDF',
        description: 'Convert Excel files to PDF format for easy sharing and printing.',
        path: '/tools/pdf/from-excel',
        icon: <FileSpreadsheet className="w-8 h-8" />,
        color: 'bg-lime-500',
        category: 'convert'
      },
      {
        id: 26,
        name: 'PDF to PowerPoint',
        description: 'Convert PDF files to editable PowerPoint presentations.',
        path: '/tools/pdf/to-ppt',
        icon: <Film className="w-8 h-8" />,
        color: 'bg-fuchsia-500',
        category: 'convert'
      },
      {
        id: 27,
        name: 'PowerPoint to PDF',
        description: 'Convert PowerPoint presentations to PDF documents.',
        path: '/tools/pdf/from-ppt',
        icon: <Film className="w-8 h-8" />,
        color: 'bg-rose-300',
        category: 'convert'
      },
      {
        id: 28,
        name: 'PDF Forms',
        description: 'Create fillable PDF forms or extract data from existing forms.',
        path: '/tools/pdf/forms',
        icon: <Clipboard className="w-8 h-8" />,
        color: 'bg-sky-400',
        category: 'edit'
      },
      {
        id: 29,
        name: 'PDF to HTML',
        description: 'Convert PDF documents to HTML web pages.',
        path: '/tools/pdf/to-html',
        icon: <Globe className="w-8 h-8" />,
        color: 'bg-cyan-400',
        category: 'convert'
      },
      {
        id: 30,
        name: 'HTML to PDF',
        description: 'Convert web pages to PDF documents for offline reading.',
        path: '/tools/pdf/from-html',
        icon: <Globe className="w-8 h-8" />,
        color: 'bg-emerald-400',
        category: 'convert'
      },
      // 🔥 Replaced emoji icons with Lucide components for consistency
      {
        id: 31,
        name: 'Remove Pages',
        description: 'Delete specific pages from your PDF document.',
        path: '/tools/pdf/remove-pages',
        icon: <Trash2 className="w-8 h-8" />,
        color: 'bg-gray-600',
        category: 'organize'
      },
      {
        id: 32,
        name: 'Extract Pages',
        description: 'Select and extract specific pages from your PDF document.',
        path: '/tools/pdf/extract-pages',
        icon: <Scissors className="w-8 h-8" />,
        color: 'bg-indigo-300',
        category: 'organize'
      },
      {
        id: 33,
        name: 'Organize PDF',
        description: 'Reorder and manage PDF pages in your document.',
        path: '/tools/pdf/organize-pdf',
        icon: <FileStack className="w-8 h-8" />,
        color: 'bg-amber-400',
        category: 'organize'
      },
      {
        id: 34,
        name: 'Scan to PDF',
        description: 'Convert scanned documents to searchable PDF files.',
        path: '/tools/pdf/scan-to-pdf',
        icon: <Camera className="w-8 h-8" />,
        color: 'bg-slate-400',
        category: 'optimize'
      },

      {
        id: 36,
        name: 'Crop PDF',
        description: 'Adjust margins and crop PDF pages to your preferred size.',
        path: '/tools/pdf/crop-pdf',
        icon: <Crop className="w-8 h-8" />,
        color: 'bg-fuchsia-300',
        category: 'edit'
      },
      {
        id: 37,
        name: 'Images to PDF',
        description: 'Convert JPG/PNG images to PDF documents.',
        path: '/tools/pdf/images-to-pdf',
        icon: <Image className="w-8 h-8" />,
        color: 'bg-pink-400',
        category: 'convert'
      },
      {
        id: 38,
        name: 'Webpage to PDF',
        description: 'Convert HTML web pages or URLs to PDF documents.',
        path: '/tools/pdf/webpage-to-pdf',
        icon: <Globe className="w-8 h-8" />,
        color: 'bg-sky-300',
        category: 'convert'
      },
      {
        id: 39,
        name: 'Word to PDF (Pro)',
        description: 'Convert DOC/DOCX files to PDF format with advanced options.',
        path: '/tools/pdf/word-to-pdf',
        icon: <FilePlus className="w-8 h-8" />,
        color: 'bg-rose-200',
        category: 'convert'
      }
  ];

  const filteredTools = activeCategory === 'all' 
    ? allTools 
    : allTools.filter(tool => tool.category === activeCategory);

  // 🔍 DEBUG: Add this to see what's happening
  console.log('🔍 PDF Tools Debug:');
  console.log('Total tools:', allTools.length);
  console.log('Active category:', activeCategory);
  console.log('Filtered tools:', filteredTools.length);
  console.log('Last 5 tools:', allTools.slice(-5));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">PDF Tools</span>
              <span className="block text-red-600">Complete Document Solution</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Every tool you need to work with PDFs, 100% FREE and easy to use!
            </p>
            {/* 🔍 DEBUG INFO - Remove this in production */}
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg inline-block">
              <p className="text-sm text-yellow-800">
                🔍 Debug: Showing <strong>{filteredTools.length}</strong> of <strong>{allTools.length}</strong> tools 
                (Category: <strong>{activeCategory}</strong>)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-gray-200 hover:border-red-300"
            >
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{tool.name}</h3>
              <p className="text-xs text-gray-400 mb-2">ID: {tool.id}</p> {/* 🔍 Debug info */}
              <p className="text-gray-600">{tool.description}</p>
            </Link>
          ))}
        </div>

        {/* No results message */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tools found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfToolsPage;