// ComparePdf.jsx - Updated with Download Button
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DownloadButton from './DownloadButton'; // Import the download button

const ComparePdf = () => {
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState({
    compareMode: 'text',
    highlightChanges: true,
    outputFormat: 'pdf'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [processedFile, setProcessedFile] = useState(null); // Store processed file data

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCompare = async () => {
    if (files.length < 2) {
      alert('Please select two PDF files to compare');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate processed file data - replace with actual API response
      const mockProcessedData = {
        url: null, // If you have a download URL from your backend
        data: new Blob(['mock comparison data'], { type: 'application/pdf' }), // Mock blob data
        fileName: `comparison_${Date.now()}`
      };
      
      setProcessedFile(mockProcessedData);
      setResult('Comparison completed successfully!');
    } catch (error) {
      console.error('Error comparing PDFs:', error);
      setResult('Error occurred during comparison');
    } finally {
      setIsProcessing(false);
    }
  };

  // Custom download handler for complex scenarios
  const handleCustomDownload = async () => {
    try {
      // Add your custom download logic here
      // For example, making an API call to get the file
      const base = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${base}/api/download-comparison`, {
        method: 'POST',
        body: JSON.stringify({ files, options }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const ct = response.headers.get('content-type') || '';
        const text = await response.text().catch(() => '');
        throw new Error(`Download failed: ${response.status} - ${ct} - ${text.substring(0,200)}`);
      }

      const contentType = response.headers.get('content-type') || '';
      // Expecting PDF or other binary
      if (!contentType.includes('application/pdf') && !contentType.includes('application/octet-stream') && !contentType.includes('application/zip')) {
        const text = await response.text();
        throw new Error(`Unexpected content-type: ${contentType}. Response: ${text.substring(0,200)}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comparison_${Date.now()}.${options.outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare PDF</h1>
          <p className="text-gray-600">Compare two PDF documents to find differences</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={true}
            maxFiles={2}
            title="Upload PDF Files to Compare"
            description="Select exactly 2 PDF files to compare"
          />
        </div>

        {/* Options Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Comparison Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compare Mode
              </label>
              <select
                value={options.compareMode}
                onChange={(e) => handleOptionChange('compareMode', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="text">Text Only</option>
                <option value="visual">Visual</option>
                <option value="both">Text + Visual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                value={options.outputFormat}
                onChange={(e) => handleOptionChange('outputFormat', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pdf">PDF Report</option>
                <option value="html">HTML Report</option>
                <option value="json">JSON Data</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlightChanges"
                checked={options.highlightChanges}
                onChange={(e) => handleOptionChange('highlightChanges', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="highlightChanges" className="ml-2 text-sm text-gray-700">
                Highlight Changes
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleCompare}
            disabled={files.length < 2 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Comparing...' : 'Compare PDFs'}
          </button>

          {/* Download Button - Only show after processing */}
          {processedFile && (
            <DownloadButton
              downloadData={processedFile.data}
              downloadUrl={processedFile.url}
              fileName={processedFile.fileName}
              fileExtension={options.outputFormat}
              disabled={isProcessing}
              variant="success"
            />
          )}
        </div>

        {/* Alternative: Custom download handler */}
        {result && result.includes('successfully') && (
          <div className="text-center mb-6">
            <DownloadButton
              onDownload={handleCustomDownload}
              fileName="pdf_comparison_report"
              fileExtension={options.outputFormat}
              disabled={isProcessing}
              variant="primary"
              className="mx-2"
            >
              Download Comparison Report
            </DownloadButton>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className={`border rounded-lg p-4 ${
            result.includes('successfully') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePdf;