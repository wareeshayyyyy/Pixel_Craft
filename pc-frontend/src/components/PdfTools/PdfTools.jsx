import React from 'react';
import { Link } from 'react-router-dom';

const PdfTools = () => {
  const pdfTools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one document",
      link: "/tools/merge-pdf",
      icon: "📑",
      category: "organize"
    },
    {
      title: "Split PDF",
      description: "Split a PDF into multiple documents",
      link: "/tools/split-pdf",
      icon: "✂️",
      category: "organize"
    },
    {
      title: "Compress PDF",
      description: "Reduce PDF file size while maintaining quality",
      link: "/tools/compress-pdf",
      icon: "🗜️",
      category: "optimize"
    },
    {
      title: "Edit PDF",
      description: "Edit text, images and content in PDF files",
      link: "/tools/edit-pdf",
      icon: "✏️",
      category: "edit"
    },
    {
      title: "Compare PDF",
      description: "Compare two PDF documents to find differences",
      link: "/tools/compare-pdf",
      icon: "🔍",
      category: "analyze"
    },
    {
      title: "OCR PDF",
      description: "Extract text from scanned PDF documents",
      link: "/tools/ocr-pdf",
      icon: "👁️",
      category: "convert"
    },
    {
      title: "Sign PDF",
      description: "Add digital signatures to PDF documents",
      link: "/tools/sign-pdf",
      icon: "✍️",
      category: "security"
    },
    {
      title: "Protect PDF",
      description: "Add password protection to PDF files",
      link: "/tools/protect-pdf",
      icon: "🔒",
      category: "security"
    },
    {
      title: "Unlock PDF",
      description: "Remove password protection from PDF files",
      link: "/tools/unlock-pdf",
      icon: "🔓",
      category: "security"
    },
    {
      title: "Watermark PDF",
      description: "Add text or image watermarks to PDF files",
      link: "/tools/watermark-pdf",
      icon: "💧",
      category: "edit"
    },
    {
      title: "Rotate PDF",
      description: "Rotate pages in PDF documents",
      link: "/tools/rotate-pdf",
      icon: "🔄",
      category: "organize"
    },
    {
      title: "Redact PDF",
      description: "Remove or black out sensitive information",
      link: "/tools/redact-pdf",
      icon: "🖤",
      category: "security"
    },
    {
      title: "Repair PDF",
      description: "Fix corrupted or damaged PDF files",
      link: "/tools/repair-pdf",
      icon: "🔧",
      category: "optimize"
    },
    {
      title: "PDF to Word",
      description: "Convert PDF documents to Word format",
      link: "/tools/pdf-to-word",
      icon: "📄",
      category: "convert"
    },
    {
      title: "PDF to Excel",
      description: "Convert PDF tables to Excel spreadsheets",
      link: "/tools/pdf-to-excel",
      icon: "📊",
      category: "convert"
    },
    {
      title: "PDF to PowerPoint",
      description: "Convert PDF to PowerPoint presentations",
      link: "/tools/pdf-to-ppt",
      icon: "📽️",
      category: "convert"
    },
    {
      title: "PDF to Text",
      description: "Extract plain text from PDF documents",
      link: "/tools/pdf-to-text",
      icon: "📝",
      category: "convert"
    },
    {
      title: "PDF to Image",
      description: "Convert PDF pages to image files",
      link: "/tools/pdf-to-image",
      icon: "🖼️",
      category: "convert"
    },
    {
      title: "PDF to PDF/A",
      description: "Convert PDF to archival PDF/A format",
      link: "/tools/pdf-to-pdfa",
      icon: "📦",
      category: "convert"
    },
    {
      title: "Excel to PDF",
      description: "Convert Excel spreadsheets to PDF",
      link: "/tools/excel-to-pdf",
      icon: "📈",
      category: "convert"
    },
    {
      title: "PowerPoint to PDF",
      description: "Convert PowerPoint presentations to PDF",
      link: "/tools/ppt-to-pdf",
      icon: "🎯",
      category: "convert"
    },
    {
      title: "Workflow",
      description: "Create automated PDF processing workflows",
      link: "/tools/workflow",
      icon: "⚡",
      category: "organize"
    }
  ];

  const categories = {
    organize: { name: "Organize", color: "bg-blue-100 text-blue-800" },
    convert: { name: "Convert", color: "bg-green-100 text-green-800" },
    edit: { name: "Edit", color: "bg-purple-100 text-purple-800" },
    security: { name: "Security", color: "bg-red-100 text-red-800" },
    optimize: { name: "Optimize", color: "bg-yellow-100 text-yellow-800" },
    analyze: { name: "Analyze", color: "bg-indigo-100 text-indigo-800" }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF Tools</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete suite of PDF tools for all your document processing needs. 
          Merge, split, convert, edit, and secure your PDF files with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pdfTools.map((tool, index) => (
          <ToolCard 
            key={index}
            title={tool.title}
            description={tool.description}
            link={tool.link}
            icon={tool.icon}
            category={categories[tool.category]}
          />
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our PDF Tools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-600">Lightning-fast PDF processing with optimized algorithms</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your files are processed securely and deleted after use</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="font-semibold mb-2">No Software Required</h3>
            <p className="text-gray-600">All tools work directly in your browser</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ title, description, link, icon, category }) => (
  <Link 
    to={link} 
    className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-1"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="text-3xl">{icon}</div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
        {category.name}
      </span>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
      Try now
      <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
);

export default PdfTools;