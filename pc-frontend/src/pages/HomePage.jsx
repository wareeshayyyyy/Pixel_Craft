import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const HomePage = () => {
  const categories = ['All', 'Optimize', 'Create', 'Edit', 'Convert', 'Security'];

  const imageTools = [
    {
      id: 'compress',
      title: 'Compress IMAGE',
      description: 'Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.',
      icon: '📉',
      path: '/tools/compress'
    },
    {
      id: 'resize',
      title: 'Resize IMAGE', 
      description: 'Define your dimensions, by percent or pixel, and resize your images.',
      icon: '🖼️',
      path: '/tools/resize'
    },
    {
      id: 'crop',
      title: 'Crop IMAGE',
      description: 'Crop JPG, PNG, or GIFs with ease. Choose pixels or use our visual editor.',
      icon: '✂️',
      path: '/tools/crop'
    },
    {
      id: 'convert-jpg',
      title: 'Convert to JPG',
      description: 'Turn PNG, GIF, TIF, PSD, SVG, WEBF, HEIC, or RAW to JPG in bulk.',
      icon: '🔄',
      path: '/tools/convert-to-jpg'
    },
    {
      id: 'convert-from-jpg',
      title: 'Convert from JPG',
      description: 'Turn JPG images to PNG and GIF. Create animated GIFs in seconds!',
      icon: '🔄',
      path: '/tools/convert-from-jpg'
    },
    {
      id: 'photo-editor',
      title: 'Photo editor',
      description: 'Spice up your pictures with text, effects, frames or stickers.',
      icon: '🎨',
      path: '/tools/photo-editor'
    },
    {
      id: 'upscale',
      title: 'Upscale Image',
      description: 'Enlarge your images with high resolution while maintaining quality.',
      icon: '🔍',
      path: '/tools/upscale'
    },
    {
      id: 'remove-bg',
      title: 'Remove background',
      description: 'Quickly remove image backgrounds with high accuracy.',
      icon: '🧹',
      path: '/tools/remove-background'
    },
    {
      id: 'watermark',
      title: 'Watermark IMAGE',
      description: 'Stamp an image or text over your images in seconds.',
      icon: '💧',
      path: '/tools/watermark'
    },
    {
      id: 'meme',
      title: 'Meme generator',
      description: 'Create your memes online with ease. Caption meme images instantly.',
      icon: '😂',
      path: '/tools/meme-generator'
    },
    {
      id: 'rotate',
      title: 'Rotate IMAGE',
      description: 'Rotate many images at same time. Choose landscape or portrait!',
      icon: '🔄',
      path: '/tools/rotate'
    },
    {
      id: 'blur',
      title: 'Blur face',
      description: 'Easily blur out faces in photos to hide private information.',
      icon: '👤',
      path: '/tools/blur-face'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 1. Hero Section - As specified */}
      <section className="bg-gradient-to-r from-red-50 to-blue-50 py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800 leading-tight">
            Elevate the power of creative editing - anywhere, anytime
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Supercharge your productivity with powerful editing solutions that bring your vision to life!
          </p>
        </div>
      </section>

      {/* 3. Choose Your Tools Section - Above supported formats */}
      <section className="py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Choose Your Tools
            </h2>
            <p className="text-slate-600 text-lg mb-8">Select the perfect toolset for your needs</p>
          </div>

          {/* Main Tool Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/tools"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-6">🛠️</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">All Tools</h3>
                <p className="text-slate-600 leading-relaxed">Access every tool in our comprehensive suite for complete image editing control</p>
              </div>
            </Link>

            <Link
              to="/tools/pdf"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-6">📄</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">PDF Tools</h3>
                <p className="text-slate-600 leading-relaxed">Powerful PDF editing, conversion, and manipulation tools for all your document needs</p>
              </div>
            </Link>

            <Link
              to="/image-tools"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-6">🖼️</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">Image Tools</h3>
                <p className="text-slate-600 leading-relaxed">Professional image editing tools for resizing, cropping, converting, and enhancing</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why Choose PixelCraft - Below choose your tools */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white/80"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Why Choose PixelCraft?
            </h2>
            <p className="text-slate-600 text-lg">Professional image editing made simple</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">Process images in seconds with our optimized algorithms and cloud infrastructure</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
                🔒
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">100% Secure</h3>
              <p className="text-slate-600 leading-relaxed">Your images are processed securely with end-to-end encryption and never stored permanently</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
                📱
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Works Anywhere</h3>
              <p className="text-slate-600 leading-relaxed">Access from any device - desktop, tablet, or mobile with responsive design</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Supported Formats Section - Above footer */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-slate-50/50"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Supported Image Formats
            </h2>
            <p className="text-slate-600 text-lg mb-12">Work with all popular image formats seamlessly</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['JPG', 'PNG', 'GIF', 'WebP', 'BMP', 'TIFF', 'SVG', 'ICO'].map((format) => (
                <span
                  key={format}
                  className="bg-white/70 backdrop-blur-sm border border-slate-200/50 px-6 py-3 rounded-2xl text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200"
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

export default HomePage;



