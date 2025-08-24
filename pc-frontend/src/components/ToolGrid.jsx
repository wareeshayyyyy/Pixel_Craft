
import React from 'react';
import ToolCard from './ToolCard';

const ToolGrid = () => {
  const tools = [
    {
      title: 'Compress IMAGE',
      description: 'Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.',
      icon: '📉',
      path: '/compress'
    },
    {
      title: 'Resize IMAGE',
      description: 'Define your dimensions, by percent or pixel, and resize your images.',
      icon: '🖼️',
      path: '/resize'
    },
    {
      title: 'Crop IMAGE',
      description: 'Crop JPG, PNG, or GIFs with ease. Choose pixels or use our visual editor.',
      icon: '✂️',
      path: '/crop'
    },
    {
      title: 'Convert to JPG',
      description: 'Turn PNG, GIF, TIF, PSD, SVG, WEBF, HEIC, or RAW to JPG in bulk.',
      icon: '🔄',
      path: '/convert-to-jpg'
    },
    {
      title: 'Convert from JPG',
      description: 'Turn JPG images to PNG and GIF. Create animated GIFs in seconds!',
      icon: '🔄',
      path: '/convert-from-jpg'
    },
    {
      title: 'Photo editor',
      description: 'Spice up your pictures with text, effects, frames or stickers.',
      icon: '🎨',
      path: '/photo-editor'
    },
    {
      title: 'Upscale Image',
      description: 'Enlarge your images with high resolution while maintaining quality.',
      icon: '🔍',
      path: '/upscale'
    },
    {
      title: 'Remove background',
      description: 'Quickly remove image backgrounds with high accuracy.',
      icon: '🧹',
      path: '/remove-bg'
    },
    {
      title: 'Watermark IMAGE',
      description: 'Stamp an image or text over your images in seconds.',
      icon: '💧',
      path: '/watermark'
    },
    {
      title: 'Meme generator',
      description: 'Create your memes online with ease. Caption meme images instantly.',
      icon: '😂',
      path: '/meme'
    },
    {
      title: 'Rotate IMAGE',
      description: 'Rotate many images at same time. Choose landscape or portrait!',
      icon: '🔄',
      path: '/rotate'
    },
    {
      title: 'Blur face',
      description: 'Easily blur out faces in photos to hide private information.',
      icon: '👤',
      path: '/blur'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">All Image Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolGrid;
