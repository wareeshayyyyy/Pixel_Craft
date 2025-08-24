import React from 'react';
import { NavLink } from 'react-router-dom';

const ToolList = ({ tools }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">PixelCraft</h1>
      
      {tools.map((tool, index) => (
        <div key={tool.id} className="mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-1">{tool.icon}</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{tool.name}</h2>
              <p className="text-gray-600 my-2">{tool.description}</p>
              {tool.path && (
                <NavLink
                  to={tool.path}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Use Tool →
                </NavLink>
              )}
            </div>
          </div>
          {index < tools.length - 1 && <hr className="border-gray-200 my-6" />}
        </div>
      ))}
    </div>
  );
};

export default ToolList;