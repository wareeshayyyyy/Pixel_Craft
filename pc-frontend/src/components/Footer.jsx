import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-red-500 mr-2">P</span>
              <h3 className="text-2xl font-bold">ixelCraft</h3>
            </div>
            <p className="text-gray-400">The fastest and easiest way to modify your images and documents online.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">PRODUCT</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/tools" className="text-gray-400 hover:text-white">All Tools</Link></li>
              <li><Link to="/business" className="text-gray-400 hover:text-white">Business</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">RESOURCES</h4>
            <ul className="space-y-2">
              <li><Link to="/tools/pdf" className="text-gray-400 hover:text-white">PDF Tools</Link></li>
              <li><Link to="/api" className="text-gray-400 hover:text-white">PixelAPI</Link></li>
              <li><Link to="/mobile" className="text-gray-400 hover:text-white">Mobile Apps</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">LEGAL</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms & conditions</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-white">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <button className="bg-black text-white px-4 py-2 rounded flex items-center">
              <span className="mr-2">Get on</span> Google Play
            </button>
            <button className="bg-black text-white px-4 py-2 rounded flex items-center">
              <span className="mr-2">Download on the</span> App Store
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="bg-gray-700 text-white px-3 py-1 rounded">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-400">
          <p>© PixelCraft {new Date().getFullYear()} • Your Image & PDF Editor</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;