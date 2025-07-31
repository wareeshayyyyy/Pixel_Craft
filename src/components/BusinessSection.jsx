import React from 'react';
import { Link } from 'react-router-dom';

const BusinessSection = ({ 
  title, 
  description, 
  actionText, 
  actionLink, 
  appStoreLink, 
  googlePlayLink,
  icon
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      {actionText && actionLink && (
        <Link 
          to={actionLink} 
          className="text-red-500 font-medium hover:text-red-600 inline-flex items-center"
        >
          {actionText}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      {appStoreLink && googlePlayLink && (
        <div className="mt-4 space-x-2">
          <a 
            href={appStoreLink} 
            className="inline-flex items-center px-3 py-2 bg-black text-white text-sm rounded"
          >
            App Store
          </a>
          <a 
            href={googlePlayLink} 
            className="inline-flex items-center px-3 py-2 bg-black text-white text-sm rounded"
          >
            Google Play
          </a>
        </div>
      )}
    </div>
  );
};

export default BusinessSection;