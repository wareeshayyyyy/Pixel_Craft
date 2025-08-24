

import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Bulk Processing',
      description: 'Edit multiple images at once',
      icon: '🔄'
    },
     {
      title: 'Secure Uploads',
      description: 'Your files are secure and automatically deleted after processing',
      icon: '🔒'
    },
    {
      title: 'No Watermarks',
      description: 'Your processed files remain watermark-free',
      icon: '🚫'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose PixelCraft?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;