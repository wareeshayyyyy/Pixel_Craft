import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PdfCategoryNav = () => {
  const location = useLocation();
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'organize', name: 'Organize PDF' },
    { id: 'optimize', name: 'Optimize PDF' },
    { id: 'convert', name: 'Convert PDF' },
    { id: 'edit', name: 'Edit PDF' },
    { id: 'security', name: 'PDF Security' },
    { id: 'workflows', name: 'Workflows' }
  ];

  return (
    <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/pdf-tools?category=${category.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              location.search.includes(`category=${category.id}`)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PdfCategoryNav;