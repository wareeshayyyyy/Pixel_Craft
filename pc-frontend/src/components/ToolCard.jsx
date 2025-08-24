import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ title, description, icon, path }) => {
  return (
    <Link to={path} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 h-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{icon}</span>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-500 transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;