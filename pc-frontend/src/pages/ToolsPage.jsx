import React, { useState } from 'react';
import ToolCategories from '../components/ToolCategories';
import PdfCategories from '../components/PdfTools/PdfCategories';

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('images');
  
  const imageCategories = [
    {
      name: 'Optimize',
      icon: '⚡',
      tools: [
        {
          name: 'Compress IMAGE',
          path: 'compress',
          description: 'Reduce file size while keeping quality'
        },
        {
          name: 'Upscale Image',
          path: 'upscale',
          description: 'Enlarge images without losing quality'
        },
        {
          name: 'Remove Background',
          path: 'remove-background',
          description: 'Automatically remove image backgrounds'
        }
      ]
    },
   {
      name: 'Create',
      icon: '🎨',
      tools: [
        {
          name: 'Photo Editor',
          path: 'photo-editor',
          description: 'Add text, stickers, effects and filters'
        },
        {
          name: 'Meme Generator',
          path: 'meme-generator',
          description: 'Create custom memes online'
        },
        {
          name: 'Collage Maker',
          path: 'collage-maker',
          description: 'Combine multiple photos into one'
        }
      ]
    },
    {
      name: 'Modify',
      icon: '✂️',
      tools: [
        {
          name: 'Resize IMAGE',
          path: 'resize',
          description: 'Change image dimensions in bulk'
        },
        {
          name: 'Crop IMAGE',
          path: 'crop',
          description: 'Cut your image online'
        },
        {
          name: 'Rotate IMAGE',
          path: 'rotate',
          description: 'Rotate multiple images at once'
        }
      ]
    },
    {
      name: 'Convert',
      icon: '🔄',
      tools: [
        {
          name: 'Convert to JPG',
          path: 'convert-to-jpg',
          description: 'Transform multiple formats to JPG'
        },
        {
          name: 'Convert from JPG',
          path: 'convert-from-jpg',
          description: 'Convert JPG to PNG, GIF, etc.'
        },
        {
          name: 'HTML to IMAGE',
          path: 'html-to-image',
          description: 'Convert webpages to images'
        }
      ]
    },
    {
      name: 'Security',
      icon: '🔒',
      tools: [
        {
          name: 'Watermark IMAGE',
          path: 'watermark',
          description: 'Protect your images with watermarks'
        },
        {
          name: 'Blur Face',
          path: 'blur-face',
          description: 'Hide faces or sensitive information'
        },
        {
          name: 'Redact PDF',
          path: 'redact-pdf',
          description: 'Permanently remove sensitive content'
        }
      ]
    }
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">All Tools</h1>
          
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'images' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('images')}
            >
              Image Tools
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'pdf' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('pdf')}
            >
              PDF Tools
            </button>
          </div>

          {activeTab === 'images' ? (
            <>
              <p className="text-lg text-gray-600 mb-8">
                Edit, convert, optimize and protect your images with our free online tools
              </p>
              <ToolCategories categories={imageCategories} />
            </>
          ) : (
            <PdfCategories />
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;