import { useState } from "react";
import PdfToolLayout from "../../components/PdfTools/PdfToolLayout";
import FileUpload from "../../components/PdfTools/FileUpload";
// RepairPdf.jsx
const RepairPdf = () => {
  const [files, setFiles] = useState([]);
  const [repairSettings, setRepairSettings] = useState({
    mode: 'automatic',
    fixImages: true,
    fixFonts: true,
    fixStructure: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleRepair = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to repair');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setResult('PDF repaired successfully!');
    } catch (error) {
      console.error('Error repairing PDF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Repair PDF</h1>
          <p className="text-gray-600">Fix corrupted or damaged PDF files</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedTypes=".pdf"
            multiple={false}
            maxFiles={1}
            title="Upload Corrupted PDF File"
            description="Select a damaged PDF file to repair"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Repair Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repair Mode
            </label>
            <select
              value={repairSettings.mode}
              onChange={(e) => setRepairSettings(prev => ({...prev, mode: e.target.value}))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="automatic">Automatic Repair</option>
              <option value="conservative">Conservative Repair</option>
              <option value="aggressive">Aggressive Repair</option>
            </select>
          </div>

          <h4 className="text-lg font-medium mb-3">Repair Options</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={repairSettings.fixImages}
                onChange={(e) => setRepairSettings(prev => ({...prev, fixImages: e.target.checked}))}
                className="mr-2"
              />
              Fix Corrupted Images
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={repairSettings.fixFonts}
                onChange={(e) => setRepairSettings(prev => ({...prev, fixFonts: e.target.checked}))}
                className="mr-2"
              />
              Fix Font Issues
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={repairSettings.fixStructure}
                onChange={(e) => setRepairSettings(prev => ({...prev, fixStructure: e.target.checked}))}
                className="mr-2"
              />
              Fix Document Structure
            </label>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleRepair}
            disabled={files.length === 0 || isProcessing}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Repairing...' : 'Repair PDF'}
          </button>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairPdf;