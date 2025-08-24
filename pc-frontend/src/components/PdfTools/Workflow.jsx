import React, { useState } from 'react';

const Workflow = () => {
  const [workflows, setWorkflows] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState({
    name: '',
    steps: [],
    triggers: {
      fileTypes: [],
      schedule: null,
      folderWatch: ''
    }
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStep, setSelectedStep] = useState('');

  const availableSteps = [
    { id: 'merge', name: 'Merge PDFs', description: 'Combine multiple PDF files' },
    { id: 'split', name: 'Split PDF', description: 'Split PDF into separate files' },
    { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF file size' },
    { id: 'extract-text', name: 'Extract Text', description: 'Extract text from PDF' },
    { id: 'add-watermark', name: 'Add Watermark', description: 'Add watermark to PDF pages' },
    { id: 'convert-to-image', name: 'Convert to Images', description: 'Convert PDF pages to images' },
    { id: 'ocr', name: 'OCR Processing', description: 'Extract text from scanned documents' },
    { id: 'password-protect', name: 'Password Protection', description: 'Add password protection' }
  ];

  const addStep = () => {
    if (!selectedStep) return;
    
    const step = availableSteps.find(s => s.id === selectedStep);
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, { ...step, settings: {} }]
    }));
    setSelectedStep('');
  };

  const removeStep = (index) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const saveWorkflow = () => {
    if (!currentWorkflow.name || currentWorkflow.steps.length === 0) {
      alert('Please provide a workflow name and add at least one step');
      return;
    }

    setWorkflows(prev => [...prev, { ...currentWorkflow, id: Date.now() }]);
    setCurrentWorkflow({
      name: '',
      steps: [],
      triggers: { fileTypes: [], schedule: null, folderWatch: '' }
    });
    setIsCreating(false);
  };

  const deleteWorkflow = (id) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF Processing Workflows</h1>
          <p className="text-gray-600">Create automated PDF processing workflows to streamline your document handling</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            Create New Workflow
          </button>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Workflow</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter workflow name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Processing Step
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedStep}
                  onChange={(e) => setSelectedStep(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a processing step</option>
                  {availableSteps.map(step => (
                    <option key={step.id} value={step.id}>{step.name}</option>
                  ))}
                </select>
                <button
                  onClick={addStep}
                  disabled={!selectedStep}
                  className={`px-4 py-2 rounded-md ${!selectedStep ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Add Step
                </button>
              </div>
            </div>

            {currentWorkflow.steps.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Current Steps:</h4>
                <ul className="space-y-2">
                  {currentWorkflow.steps.map((step, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{step.name}</p>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                      <button
                        onClick={() => removeStep(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsCreating(false)}
                className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveWorkflow}
                disabled={!currentWorkflow.name || currentWorkflow.steps.length === 0}
                className={`py-2 px-4 rounded-md text-white ${!currentWorkflow.name || currentWorkflow.steps.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Save Workflow
              </button>
            </div>
          </div>
        )}

        {workflows.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Workflows</h3>
            {workflows.map(workflow => (
              <div key={workflow.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium">{workflow.name}</h4>
                    <p className="text-sm text-gray-600">{workflow.steps.length} steps</p>
                  </div>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
                <ul className="space-y-2">
                  {workflow.steps.map((step, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded-md">
                      {step.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflow;
















/* import React, { useState, useEffect } from 'react';
import { Plus, X, Play, Settings, FileText, Clock, Folder } from 'lucide-react';

const Workflow = () => {
  const [workflows, setWorkflows] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState({
    name: '',
    description: '',
    steps: [],
    triggers: {
      fileTypes: [],
      schedule: null,
      folderWatch: ''
    }
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStep, setSelectedStep] = useState('');
  const [executingWorkflows, setExecutingWorkflows] = useState(new Set());

  const availableSteps = [
    { 
      id: 'merge', 
      name: 'Merge PDFs', 
      description: 'Combine multiple PDF files into one document',
      icon: '📄',
      category: 'Combine'
    },
    { 
      id: 'split', 
      name: 'Split PDF', 
      description: 'Split PDF into separate files by pages or bookmarks',
      icon: '✂️',
      category: 'Extract'
    },
    { 
      id: 'compress', 
      name: 'Compress PDF', 
      description: 'Reduce PDF file size while maintaining quality',
      icon: '🗜️',
      category: 'Optimize'
    },
    { 
      id: 'extract-text', 
      name: 'Extract Text', 
      description: 'Extract all text content from PDF documents',
      icon: '📝',
      category: 'Extract'
    },
    { 
      id: 'add-watermark', 
      name: 'Add Watermark', 
      description: 'Add text or image watermark to PDF pages',
      icon: '🔖',
      category: 'Modify'
    },
    { 
      id: 'convert-to-image', 
      name: 'Convert to Images', 
      description: 'Convert PDF pages to PNG or JPG images',
      icon: '🖼️',
      category: 'Convert'
    },
    { 
      id: 'ocr', 
      name: 'OCR Processing', 
      description: 'Extract text from scanned documents using OCR',
      icon: '👁️',
      category: 'Extract'
    },
    { 
      id: 'password-protect', 
      name: 'Password Protection', 
      description: 'Add password protection and encryption',
      icon: '🔒',
      category: 'Security'
    },
    { 
      id: 'remove-password', 
      name: 'Remove Password', 
      description: 'Remove password protection from PDFs',
      icon: '🔓',
      category: 'Security'
    },
    { 
      id: 'rotate-pages', 
      name: 'Rotate Pages', 
      description: 'Rotate PDF pages to correct orientation',
      icon: '🔄',
      category: 'Modify'
    }
  ];

  const fileTypes = [
    { value: 'pdf', label: 'PDF Files (.pdf)' },
    { value: 'doc', label: 'Word Documents (.doc, .docx)' },
    { value: 'image', label: 'Images (.jpg, .png, .tiff)' },
    { value: 'all', label: 'All supported files' }
  ];

  // Load workflows from localStorage on component mount
  useEffect(() => {
    const savedWorkflows = localStorage.getItem('pdfWorkflows');
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    }
  }, []);

  // Save workflows to localStorage whenever workflows change
  useEffect(() => {
    localStorage.setItem('pdfWorkflows', JSON.stringify(workflows));
  }, [workflows]);

  const addStep = () => {
    if (!selectedStep) return;
    
    const step = availableSteps.find(s => s.id === selectedStep);
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, { 
        ...step, 
        id: `${step.id}_${Date.now()}`,
        settings: {},
        order: prev.steps.length + 1
      }]
    }));
    setSelectedStep('');
  };

  const removeStep = (stepId) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  const moveStep = (stepId, direction) => {
    setCurrentWorkflow(prev => {
      const steps = [...prev.steps];
      const currentIndex = steps.findIndex(step => step.id === stepId);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= steps.length) return prev;
      
      [steps[currentIndex], steps[newIndex]] = [steps[newIndex], steps[currentIndex]];
      
      return { ...prev, steps };
    });
  };

  const saveWorkflow = () => {
    if (!currentWorkflow.name.trim() || currentWorkflow.steps.length === 0) {
      alert('Please provide a workflow name and add at least one step');
      return;
    }

    const newWorkflow = {
      ...currentWorkflow,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      executionCount: 0
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    resetForm();
  };

  const resetForm = () => {
    setCurrentWorkflow({
      name: '',
      description: '',
      steps: [],
      triggers: { fileTypes: [], schedule: null, folderWatch: '' }
    });
    setIsCreating(false);
    setSelectedStep('');
  };

  const deleteWorkflow = (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      setWorkflows(prev => prev.filter(w => w.id !== id));
    }
  };

  const duplicateWorkflow = (workflow) => {
    const duplicated = {
      ...workflow,
      id: Date.now(),
      name: `${workflow.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      executionCount: 0
    };
    setWorkflows(prev => [...prev, duplicated]);
  };

  const executeWorkflow = async (workflowId) => {
    setExecutingWorkflows(prev => new Set(prev).add(workflowId));
    
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update execution count
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, executionCount: (w.executionCount || 0) + 1, lastExecuted: new Date().toISOString() }
        : w
    ));
    
    setExecutingWorkflows(prev => {
      const newSet = new Set(prev);
      newSet.delete(workflowId);
      return newSet;
    });
  };

  const handleFileTypeChange = (fileType) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      triggers: {
        ...prev.triggers,
        fileTypes: prev.triggers.fileTypes.includes(fileType)
          ? prev.triggers.fileTypes.filter(type => type !== fileType)
          : [...prev.triggers.fileTypes, fileType]
      }
    }));
  };

  const categorizedSteps = availableSteps.reduce((acc, step) => {
    if (!acc[step.category]) acc[step.category] = [];
    acc[step.category].push(step);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header }
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PDF Processing Workflows
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create powerful automated workflows to streamline your document processing tasks. 
              Build, customize, and execute complex PDF operations with ease.
            </p>
          </div>

          {/* Stats }
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{workflows.length}</div>
              <div className="text-gray-600">Active Workflows</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {workflows.reduce((sum, w) => sum + (w.executionCount || 0), 0)}
              </div>
              <div className="text-gray-600">Total Executions</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{availableSteps.length}</div>
              <div className="text-gray-600">Available Steps</div>
            </div>
          </div>

          {/* Create Button }
          <div className="mb-8">
            <button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Create New Workflow
            </button>
          </div>

          {/* Create Workflow Form }
          {isCreating && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Create New Workflow</h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info }
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workflow Name *
                    </label>
                    <input
                      type="text"
                      value={currentWorkflow.name}
                      onChange={(e) => setCurrentWorkflow(prev => ({...prev, name: e.target.value}))}
                      placeholder="e.g., Invoice Processing Pipeline"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={currentWorkflow.description}
                      onChange={(e) => setCurrentWorkflow(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe what this workflow does..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Trigger File Types
                    </label>
                    <div className="space-y-2">
                      {fileTypes.map(fileType => (
                        <label key={fileType.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={currentWorkflow.triggers.fileTypes.includes(fileType.value)}
                            onChange={() => handleFileTypeChange(fileType.value)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{fileType.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Steps }
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Add Processing Steps
                    </label>
                    <div className="space-y-3">
                      <select
                        value={selectedStep}
                        onChange={(e) => setSelectedStep(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a processing step</option>
                        {Object.entries(categorizedSteps).map(([category, steps]) => (
                          <optgroup key={category} label={category}>
                            {steps.map(step => (
                              <option key={step.id} value={step.id}>
                                {step.icon} {step.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <button
                        onClick={addStep}
                        disabled={!selectedStep}
                        className={`w-full p-3 rounded-lg font-medium transition-colors ${
                          !selectedStep 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Add Step to Workflow
                      </button>
                    </div>
                  </div>

                  {/* Current Steps }
                  {currentWorkflow.steps.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 text-gray-900">Workflow Steps ({currentWorkflow.steps.length})</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {currentWorkflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{step.icon}</span>
                              <div>
                                <p className="font-medium text-gray-900">{step.name}</p>
                                <p className="text-xs text-gray-600">{step.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveStep(step.id, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveStep(step.id, 'down')}
                                disabled={index === currentWorkflow.steps.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => removeStep(step.id)}
                                className="p-1 text-red-500 hover:text-red-700 ml-2"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions }
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveWorkflow}
                  disabled={!currentWorkflow.name.trim() || currentWorkflow.steps.length === 0}
                  className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                    !currentWorkflow.name.trim() || currentWorkflow.steps.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Save Workflow
                </button>
              </div>
            </div>
          )}

          {/* Workflows List }
          {workflows.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Your Workflows</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {workflows.map(workflow => (
                  <div key={workflow.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{workflow.name}</h4>
                        {workflow.description && (
                          <p className="text-gray-600 text-sm mb-3">{workflow.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText size={14} />
                            {workflow.steps.length} steps
                          </span>
                          <span className="flex items-center gap-1">
                            <Play size={14} />
                            {workflow.executionCount || 0} runs
                          </span>
                          {workflow.lastExecuted && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {new Date(workflow.lastExecuted).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => executeWorkflow(workflow.id)}
                          disabled={executingWorkflows.has(workflow.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            executingWorkflows.has(workflow.id)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title="Execute workflow"
                        >
                          <Play size={16} />
                        </button>
                        <button
                          onClick={() => duplicateWorkflow(workflow)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="Duplicate workflow"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteWorkflow(workflow.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Delete workflow"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Processing Steps:</h5>
                      <div className="flex flex-wrap gap-2">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                            <span>{step.icon}</span>
                            <span className="text-gray-700">{step.name}</span>
                            {index < workflow.steps.length - 1 && (
                              <span className="text-gray-400 ml-1">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {workflow.triggers.fileTypes.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <strong>Triggers:</strong> {workflow.triggers.fileTypes.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {workflows.length === 0 && !isCreating && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workflows yet</h3>
              <p className="text-gray-600 mb-6">Create your first workflow to start automating PDF processing tasks</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Your First Workflow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workflow; */