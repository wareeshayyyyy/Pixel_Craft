import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to your account!</h2>
        <p className="text-gray-600">
          Here you can manage your account settings, view your tool usage history, 
          and access your saved files.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Recent Tools</h3>
            <p className="text-sm text-blue-600 mt-2">View your recently used tools</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Files</h3>
            <p className="text-sm text-green-600 mt-2">Access your saved files</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Account Settings</h3>
            <p className="text-sm text-purple-600 mt-2">Manage your preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;