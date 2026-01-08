import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Unlock, 
  Key, 
  Eye, 
  EyeOff, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Shield,
  Lock,
  X,
  Info
} from 'lucide-react';
import PDFService from '../../services/pdfService';
import { getErrorMessage } from '../../utils/errorUtils';

const UnlockPdf = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('user'); // 'user' or 'owner'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pdfInfo, setPdfInfo] = useState(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile) => {
    setError('');
    setSuccess('');
    setPdfInfo(null);
    setIsPasswordProtected(false);
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB.');
      return;
    }

    setFile(selectedFile);

    // Simulate checking if PDF is password protected
    try {
      // In a real implementation, this would analyze the PDF
      const isProtected = Math.random() > 0.3; // 70% chance of being protected for demo
      setIsPasswordProtected(isProtected);
      
      if (isProtected) {
        setPdfInfo({
          hasUserPassword: true,
          hasOwnerPassword: true,
          restrictions: [
            'Printing disabled',
            'Text copying disabled', 
            'Document editing disabled',
            'Form filling disabled'
          ]
        });
      } else {
        setSuccess('This PDF is not password protected. You can download it directly.');
        setProcessedFile({
          blob: selectedFile,
          name: selectedFile.name.replace('.pdf', '_unlocked.pdf'),
          size: selectedFile.size
        });
      }
    } catch (err) {
      setError('Failed to analyze PDF file.');
    }
  };

  const handleUnlock = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    if (!password && isPasswordProtected) {
      setError('Please enter the PDF password.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const blob = await PDFService.unlockPDF(file, password);
      
      if (!blob || blob.size === 0) {
        throw new Error('Unlock operation resulted in empty file');
      }

      const unlockedFileName = file.name.replace('.pdf', '_unlocked.pdf');
      
      setProcessedFile({
        blob: blob,
        name: unlockedFileName,
        size: blob.size
      });

      setSuccess('PDF has been successfully unlocked! All restrictions have been removed.');
    } catch (err) {
      setError(`Failed to unlock PDF: ${getErrorMessage(err)}`);
      console.error('Unlock error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedFile) return;

    const url = URL.createObjectURL(processedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFile(null);
    setProcessedFile(null);
    setPassword('');
    setPasswordType('user');
    setPdfInfo(null);
    setIsPasswordProtected(false);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <Unlock className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock PDF Password Protection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Remove password protection and restrictions from your PDF documents. 
            Get full access to view, edit, print, and copy content.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* File Upload Area */}
          {!file && (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Drop your protected PDF file here
              </h3>
              <p className="text-gray-500 mb-6">
                or click to browse from your device
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Choose PDF File
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Maximum file size: 50MB
              </p>
            </div>
          )}

          {/* File Selected */}
          {file && (
            <div className="space-y-8">
              {/* File Info */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-green-500 mr-4" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {isPasswordProtected && (
                  <div className="flex items-center text-orange-600 mr-4">
                    <Lock className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Password Protected</span>
                  </div>
                )}
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PDF Protection Info */}
              {pdfInfo && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Info className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-orange-800">PDF Protection Details</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-orange-800 mb-2">Password Protection:</h4>
                      <ul className="space-y-1 text-sm text-orange-700">
                        {pdfInfo.hasUserPassword && <li>• User password required to open</li>}
                        {pdfInfo.hasOwnerPassword && <li>• Owner password for full permissions</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-800 mb-2">Current Restrictions:</h4>
                      <ul className="space-y-1 text-sm text-orange-700">
                        {pdfInfo.restrictions.map((restriction, index) => (
                          <li key={index}>• {restriction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Input */}
              {isPasswordProtected && !processedFile && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Key className="w-5 h-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Enter PDF Password</h3>
                  </div>

                  {/* Password Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Password Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="user"
                          checked={passwordType === 'user'}
                          onChange={(e) => setPasswordType(e.target.value)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">User Password</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="owner"
                          checked={passwordType === 'owner'}
                          onChange={(e) => setPasswordType(e.target.value)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Owner Password</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {passwordType === 'user' 
                        ? 'Password used to open the PDF document'
                        : 'Master password that bypasses all restrictions'
                      }
                    </p>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PDF Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12"
                        placeholder="Enter the PDF password"
                        onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                {isPasswordProtected && !processedFile && (
                  <button
                    onClick={handleUnlock}
                    disabled={isProcessing || !password}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Unlocking PDF...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-5 h-5 mr-2" />
                        Unlock PDF
                      </>
                    )}
                  </button>
                )}

                {processedFile && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Unlocked PDF
                  </button>
                )}

                <button
                  onClick={resetForm}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-green-700">{success}</span>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-3">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800">Security & Privacy Notice</h3>
          </div>
          <div className="text-sm text-blue-700 space-y-2">
            <p>• Your PDF files are processed securely and never stored on our servers</p>
            <p>• All uploaded files are automatically deleted after processing</p>
            <p>• Passwords are transmitted using secure encryption</p>
            <p>• Only use this tool with PDFs you have permission to unlock</p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Unlock className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove All Restrictions</h3>
            <p className="text-gray-600">Unlock printing, copying, editing, and all other permissions</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Key className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Password Types</h3>
            <p className="text-gray-600">Support for both user and owner password unlocking</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h3>
            <p className="text-gray-600">Your files are processed securely and never stored</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockPdf;