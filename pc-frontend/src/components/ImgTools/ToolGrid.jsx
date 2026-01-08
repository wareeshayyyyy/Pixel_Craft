// ToolGrid.js - Updated to properly handle tool selection and rendering
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Image, 
  FileText, 
  Scissors, 
  Merge, 
  FileDown,
  RotateCw,
  Type,
  Crop,
  Shield,
  Upload
} from 'lucide-react';

// Import tool components
import BlurFace from '../../pages/tools/BlurFace';
import CompressImage from '../../pages/tools/CompressImage';
import ResizeImage from '../../pages/tools/ResizeImage';

const ToolGrid = () => {
  const [activeInlineToolId, setActiveInlineToolId] = useState(null);

  const imageTools = [
    {
      id: 'compress',
      title: 'Compress Images',
      description: 'Reduce image file size while maintaining quality',
      icon: <FileDown className="w-8 h-8" />,
      color: 'bg-red-500',
      component: CompressImage,
      hasInlineView: true
    },
    {
      id: 'resize',
      title: 'Resize Images', 
      description: 'Change image dimensions and aspect ratio',
      icon: <Crop className="w-8 h-8" />,
      color: 'bg-red-500',
      component: ResizeImage,
      hasInlineView: true
    },
    {
      id: 'convert',
      title: 'Convert Images',
      description: 'Convert between JPG, PNG, WEBP, SVG formats',
      icon: <Image className="w-8 h-8" />,
      color: 'bg-red-500',
      path: '/tools/convert-to-jpg'
    },
    {
      id: 'rotate',
      title: 'Rotate Images',
      description: 'Rotate and flip images in any direction',
      icon: <RotateCw className="w-8 h-8" />,
      color: 'bg-red-500',
      path: '/tools/rotate'
    },
    {
      id: 'watermark',
      title: 'Add Watermark',
      description: 'Add text or image watermarks to your photos',
      icon: <Type className="w-8 h-8" />,
      color: 'bg-red-500',
      path: '/tools/watermark'
    },
    {
      id: 'background',
      title: 'Remove Background',
      description: 'AI-powered background removal tool',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-red-500',
      path: '/tools/background'
    },
    {
      id: 'blur-face',
      title: 'Blur Face',
      description: 'Easily blur out faces in photos to hide private information',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-red-500',
      component: BlurFace,
      hasInlineView: true
    }
  ];

  const pdfTools = [
    {
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one',
      icon: <Merge className="w-8 h-8" />,
      color: 'bg-indigo-500',
      path: '/tools/merge-pdf'
    },
    {
      title: 'Split PDFs',
      description: 'Split PDF into separate pages',
      icon: <Scissors className="w-8 h-8" />,
      color: 'bg-yellow-500',
      path: '/tools/split-pdf'
    },
    {
      title: 'Compress PDF',
      description: 'Reduce PDF file size',
      icon: <FileDown className="w-8 h-8" />,
      color: 'bg-red-500',
      path: '/tools/compress-pdf'
    },
    {
      title: 'PDF to Word',
      description: 'Convert PDF to editable Word document',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-red-500',
      path: '/tools/pdf-to-word'
    }
  ];

  const handleToolClick = (tool) => {
    if (tool.hasInlineView && tool.component) {
      // Toggle inline view
      if (activeInlineToolId === tool.id) {
        setActiveInlineToolId(null);
      } else {
        setActiveInlineToolId(tool.id);
      }
    }
    // For tools with paths, the Link component will handle navigation
  };

  const renderInlineTool = (tool) => {
    if (activeInlineToolId !== tool.id || !tool.component) return null;
    
    const ToolComponent = tool.component;
    return (
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{tool.title}</h3>
          <button
            onClick={() => setActiveInlineToolId(null)}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ✕ Close
          </button>
        </div>
        <ToolComponent isHomePage={true} />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Image Tools Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <Image className="inline-block w-8 h-8 mr-3" />
            Image Tools
          </h2>
          <p className="text-gray-600">
            Professional image editing tools for all your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageTools.map((tool) => {
            // If tool has a path, render as Link
            if (tool.path) {
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 block"
                >
                  <div className="p-6">
                    <div className={`${tool.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}>
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {tool.description}
                    </p>
                                      <div className="flex items-center text-red-500 font-medium">
                    <span>Open Tool</span>
                    <Upload className="w-4 h-4 ml-2" />
                  </div>
                  </div>
                </Link>
              );
            }

            // For tools with inline components
            return (
              <div
                key={tool.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                  activeInlineToolId === tool.id ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => handleToolClick(tool)}
              >
                <div className="p-6">
                  <div className={`${tool.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-red-500 font-medium">
                    <span>{activeInlineToolId === tool.id ? 'Close Tool' : 'Try it now'}</span>
                    <Upload className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Render inline tool if active */}
        {activeInlineToolId && (
          <div className="mt-8">
            {(() => {
              const activeTool = imageTools.find(tool => tool.id === activeInlineToolId);
              return activeTool ? renderInlineTool(activeTool) : null;
            })()}
          </div>
        )}
      </section>

      {/* PDF Tools Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <FileText className="inline-block w-8 h-8 mr-3" />
            PDF Tools
          </h2>
          <p className="text-gray-600">
            Complete PDF manipulation and conversion suite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pdfTools.map((tool, index) => (
            <Link
              key={index}
              to={tool.path}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 block"
            >
              <div className="p-6">
                <div className={`${tool.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}>
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="text-center bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Need more tools?
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Explore our complete collection of image and PDF editing tools
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/all-tools"
            className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Tools
          </Link>
          <Link
            to="/signup"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-500 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ToolGrid;