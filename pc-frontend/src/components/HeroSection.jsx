import React from 'react';
import { NavLink } from 'react-router-dom';

const HeroSection = () => {
  const categories = ['All', 'Optimize', 'Create', 'Edit', 'Convert', 'Security'];
  
  return (
    <section className="bg-gradient-to-r from-red-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Every tool you could want to edit images in bulk
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your online photo editor is here and forever free!
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <NavLink
              key={category}
              to={`/tools?category=${category.toLowerCase()}`}
              className="px-6 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              {category}
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;