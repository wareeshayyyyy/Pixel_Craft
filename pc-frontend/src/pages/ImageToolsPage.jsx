import React, { useState } from 'react';
import { 
  Image, 
  FileDown,
  RotateCw,
  Type,
  Crop,
  Shield,
  Upload,
  Edit,
  Zap,
  Palette,
  Camera,
  Layers,
  Grid,
  Filter
} from 'lucide-react';

const ImageToolsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Image Tools', icon: <Grid className="w-5 h-5" /> },
    { id: 'optimize', name: 'Optimize', icon: <Zap className="w-5 h-5" /> },
    { id: 'convert', name: 'Convert', icon: <Image className="w-5 h-5" /> },
    { id: 'edit', name: 'Edit', icon: <Edit className="w-5 h-5" /> },
    { id: 'enhance', name: 'Enhance', icon: <Filter className="w-5 h-5" /> },
    { id: 'create', name: 'Create', icon: <Palette className="w-5 h-5" /> }
  ];

  const allTools = [
    // Optimize Tools
    {
      id: 1,
      name: 'Compress Images',
      description: 'Reduce image file size while maintaining quality. Support for JPG, PNG, WebP.',
      path: '/tools/compress',
      icon: <FileDown className="text-blue-500" size={32} />,
      category: 'optimize',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 2,
      name: 'Resize Images',
      description: 'Change image dimensions by pixels or percentage. Batch resize multiple images.',
      path: '/tools/resize',
      icon: <Crop className="text-green-500" size={32} />,
      category: 'optimize',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 3,
      name: 'Upscale Images',
      description: 'Enlarge images using AI while maintaining quality and sharpness.',
      path: '/tools/upscale',
      icon: <Zap className="text-purple-500" size={32} />,
      category: 'enhance',
      color: 'bg-purple-50 border-purple-200'
    },

    // Convert Tools
    {
      id: 4,
      name: 'Convert to JPG',
      description: 'Convert PNG, GIF, WebP, BMP, TIFF and other formats to JPG.',
      path: '/tools/convert-to-jpg',
      icon: <Image className="text-orange-500" size={32} />,
      category: 'convert',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 5,
      name: 'Convert to PNG',
      description: 'Convert JPG, GIF, WebP and other formats to PNG with transparency.',
      path: '/tools/convert-to-png',
      icon: <Layers className="text-cyan-500" size={32} />,
      category: 'convert',
      color: 'bg-cyan-50 border-cyan-200'
    },
    {
      id: 6,
      name: 'Convert to WebP',
      description: 'Convert images to modern WebP format for better compression.',
      path: '/tools/convert-to-webp',
      icon: <Image className="text-indigo-500" size={32} />,
      category: 'convert',
      color: 'bg-indigo-50 border-indigo-200'
    },

    // Edit Tools
    {
      id: 7,
      name: 'Crop Images',
      description: 'Crop images to specific dimensions or aspect ratios with visual editor.',
      path: '/tools/crop',
      icon: <Crop className="text-red-500" size={32} />,
      category: 'edit',
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 8,
      name: 'Rotate Images',
      description: 'Rotate images by any angle, flip horizontally or vertically.',
      path: '/tools/rotate',
      icon: <RotateCw className="text-blue-500" size={32} />,
      category: 'edit',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 9,
      name: 'Add Watermark',
      description: 'Add text or image watermarks to protect your images from theft.',
      path: '/tools/watermark',
      icon: <Type className="text-green-500" size={32} />,
      category: 'edit',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 10,
      name: 'Remove Background',
      description: 'AI-powered background removal. Get transparent PNG instantly.',
      path: '/tools/remove-background',
      icon: <Shield className="text-purple-500" size={32} />,
      category: 'edit',
      color: 'bg-purple-50 border-purple-200'
    },

    // Enhance Tools
    {
      id: 11,
      name: 'Blur Face',
      description: 'Automatically detect and blur faces to protect privacy.',
      path: '/tools/blur-face',
      icon: <Camera className="text-gray-500" size={32} />,
      category: 'enhance',
      color: 'bg-gray-50 border-gray-200'
    },
    {
      id: 12,
      name: 'Photo Editor',
      description: 'Advanced photo editing with filters, effects, and adjustments.',
      path: '/tools/photo-editor',
      icon: <Edit className="text-pink-500" size={32} />,
      category: 'enhance',
      color: 'bg-pink-50 border-pink-200'
    },

    // Create Tools
    {
      id: 13,
      name: 'Meme Generator',
      description: 'Create funny memes with custom text and popular templates.',
      path: '/tools/meme-generator',
      icon: <Palette className="text-yellow-500" size={32} />,
      category: 'create',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 14,
      name: 'Collage Maker',
      description: 'Combine multiple images into beautiful collages and layouts.',
      path: '/tools/collage-maker',
      icon: <Grid className="text-teal-500" size={32} />,
      category: 'create',
      color: 'bg-teal-50 border-teal-200'
    },
    {
      id: 15,
      name: 'HTML to Image',
      description: 'Convert HTML code or web pages to high-quality images.',
      path: '/tools/html-to-image',
      icon: <Image className="text-indigo-500" size={32} />,
      category: 'create',
      color: 'bg-indigo-50 border-indigo-200'
    }
  ];

  const filteredTools = activeCategory === 'all'
    ? allTools
    : allTools.filter(tool => tool.category === activeCategory);

  const CategoryNav = ({ categories, activeCategory, setActiveCategory }) => (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeCategory === category.id
              ? 'bg-red-500 text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-red-300'
          }`}
        >
          {category.icon}
          <span className="ml-2">{category.name}</span>
        </button>
      ))}
    </div>
  );

  const HeroSection = () => (
    <section className="bg-gradient-to-r from-red-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Every tool you could want to edit images in bulk
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Edit, convert, optimize, and enhance your images with ease!
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
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.path}
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
            </a>
          ))}
        </div>

      </div>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Our Image Tools?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Process images in seconds with our optimized algorithms and powerful servers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-3">100% Secure</h3>
              <p className="text-gray-600">Your images are processed securely and automatically deleted after processing</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold mb-3">High Quality</h3>
              <p className="text-gray-600">Professional-grade results with advanced algorithms and AI technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Supported Image Formats</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['JPG', 'PNG', 'GIF', 'WebP', 'BMP', 'TIFF', 'SVG', 'ICO', 'HEIC', 'RAW'].map((format) => (
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

export default ImageToolsPage;