
import React from 'react';
import { Link } from 'react-router-dom';

const ToolCategories = ({ categories }) => {
  return (
    <div className="space-y-8">
      {categories.map((category, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-3xl mr-3">{category.icon}</span>
            {category.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.tools.map((tool, toolIndex) => (
              <Link
                key={toolIndex}
                to={`/tools/${tool.path}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-xs transition-all"
              >
                <h3 className="font-medium text-lg">{tool.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolCategories;
