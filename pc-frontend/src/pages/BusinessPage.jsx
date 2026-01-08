import React from 'react';
import { Link } from 'react-router-dom';
import BusinessSection from '../components/BusinessSection';

const BusinessPage = () => {
  const businessFeatures = [
    {
      icon: '🏢',
      title: 'Enterprise Solutions',
      description: 'Scalable document processing solutions for businesses of all sizes',
      features: ['Bulk processing', 'API integration', 'White-label options', 'Priority support']
    },
    {
      icon: '🔒',
      title: 'Enhanced Security',
      description: 'Advanced security features for sensitive business documents',
      features: ['End-to-end encryption', 'Compliance certifications', 'Audit trails', 'Role-based access']
    },
    {
      icon: '⚡',
      title: 'High Performance',
      description: 'Lightning-fast processing with guaranteed uptime',
      features: ['99.9% uptime SLA', 'Dedicated servers', 'Load balancing', 'CDN delivery']
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your document processing workflow',
      features: ['Usage analytics', 'Performance metrics', 'Custom reports', 'Real-time monitoring']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <section className="bg-gradient-to-r from-red-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            PixelCraft Business
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Advanced tools for your professional workflow
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Work Your Way Section */}
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

          {/* Enterprise Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Enterprise Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {businessFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-start mb-4">
                    <div className="text-4xl mr-4">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of businesses already using PixelCraft to streamline their operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Start Free Trial
                </button>
                <Link 
                  to="/tools" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors inline-block"
                >
                  Explore All Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;