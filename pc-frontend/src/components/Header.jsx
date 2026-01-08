import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-red-500 mr-1">P</span>
          <h1 className="text-2xl font-bold text-gray-800">ixelCraft</h1>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/"
            className={`font-medium ${location.pathname === '/' ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            Home
          </Link>
          <Link 
            to="/tools"
            className={`font-medium ${location.pathname === '/tools' ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            All Tools
          </Link>
          <Link 
            to="/image-tools"
            className={`font-medium ${location.pathname === '/image-tools' ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            Image Tools
          </Link>
          <Link 
            to="/tools/pdf"
            className={`font-medium ${location.pathname.startsWith('/tools/pdf') ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            PDF Tools
          </Link>
          <Link 
            to="/business"
            className={`font-medium ${location.pathname === '/business' ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            Business
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/login"
            className="px-4 py-2 text-gray-600 hover:text-red-500 font-medium"
          >
            Login
          </Link>
          <Link 
            to="/signup"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;