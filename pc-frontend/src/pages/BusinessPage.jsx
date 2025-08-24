import React from 'react';
import { Link } from 'react-router-dom';
import BusinessSection from '../components/BusinessSection';
import PdfCategories from '../components/PdfTools/PdfCategories';
import ToolGrid from '../components/ToolGrid';

const BusinessPage = () => {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">PixelCraft Business</h1>
            <p className="text-xl text-gray-600">
              Advanced tools for your professional workflow
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Work your way</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <BusinessSection 
                title="Business Contracts"
                description="Use PixelCraft to simplify document editing when your work goes beyond basic needs"
                actionText="Switch to document mode →"
                actionLink="/tools/pdf"
                icon="📄"
              />

              <BusinessSection 
                title="Scan and edit on the go"
                description="Scan paper documents and access quick tools anytime with the PixelCraft Mobile App"
                appStoreLink="#"
                googlePlayLink="#"
                icon="📱"
              />

              <BusinessSection 
                title="Scale with the PixelCraft API"
                description="Automate image and document tasks at scale by integrating powerful editing tools into your product or workflow"
                actionText="Learn about API →"
                actionLink="/api-docs"
                icon="⚙️"
              />
            </div>
          </section>

          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Document Tools</h3>
            <PdfCategories />
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Image Tools</h3>
            <ToolGrid category="business" />
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;