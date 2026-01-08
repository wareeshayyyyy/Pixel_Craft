import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentFiles, setRecentFiles] = useState([
    { name: 'Document1.pdf', date: '2023-05-15', size: '2.4 MB' },
    { name: 'Contract.pdf', date: '2023-05-10', size: '1.8 MB' },
    { name: 'Report.pdf', date: '2023-05-05', size: '3.2 MB' },
  ]);

  const featuredTools = [
    { id: 'merge', name: 'Merge PDF', icon: '📄+📄', description: 'Combine multiple PDFs into one' },
    { id: 'split', name: 'Split PDF', icon: '✂️📄', description: 'Divide a PDF into multiple files' },
    { id: 'compress', name: 'Compress PDF', icon: '📄↓', description: 'Reduce PDF file size' },
    { id: 'convert-word', name: 'PDF to Word', icon: '📄→📝', description: 'Convert PDFs to editable Word docs' },
  ];

  const handleToolClick = (toolId) => {
    navigate(`/tools/${toolId}`);
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welcome to PDF Tools</h1>
        <p>All the tools you need to work with PDFs in one place</p>
      </div>
      
      <div className="recent-files-section">
        <h2>Your Recent Files</h2>
        <div className="files-list">
          {recentFiles.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name}</span>
              <span>{file.date}</span>
              <span>{file.size}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="featured-tools-section">
        <h2>Featured Tools</h2>
        <div className="tools-grid">
          {featuredTools.map(tool => (
            <div
              key={tool.id}
              className="tool-card"
              onClick={() => handleToolClick(tool.id)}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-description">{tool.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="quick-actions">
        <button className="quick-action-button">
          Upload PDF
        </button>
        <button className="quick-action-button">
          Create New
        </button>
      </div>
    </div>
  );
};

export default Dashboard;