import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Key,
  Settings,
  X
} from 'lucide-react';
import PDFService from '../../services/pdfService';
import { getErrorMessage } from '../../utils/errorUtils';

const ProtectPdf = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    userPassword: '',
    confirmPassword: '',
    ownerPassword: ''
  });
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: false,
    editing: false,
    commenting: true,
    formFilling: true,
    pageExtraction: false,
    accessibility: true
  });
  const [encryptionLevel, setEncryptionLevel] = useState('128-bit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleFile = (selectedFile) => {
    setError('');
    setSuccess('');
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB.');
      return;
    }

    setFile(selectedFile);
  };

  const validatePasswords = () => {
    if (!passwords.userPassword) {
      setError('User password is required.');
      return false;
    }

    if (passwords.userPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (passwords.userPassword !== passwords.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleProtect = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const protectionSettings = {
        userPassword: passwords.userPassword,
        ownerPassword: passwords.ownerPassword || passwords.userPassword,
        encryptionLevel: encryptionLevel,
        permissions: permissions
      };

      const blob = await PDFService.protectPDF(file, protectionSettings);
      
      if (!blob || blob.size === 0) {
        throw new Error('Protection resulted in empty file');
      }

      const protectedFileName = file.name.replace('.pdf', '_protected.pdf');
      
      setProcessedFile({
        blob: blob,
        name: protectedFileName,
        size: blob.size
      });

      setSuccess('PDF has been successfully protected with password and permissions!');
    } catch (err) {
      console.error('Protection error:', err);
      setError(`Failed to protect PDF: ${getErrorMessage(err)}`);
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
    setPasswords({ userPassword: '', confirmPassword: '', ownerPassword: '' });
    setPermissions({
      printing: true,
      copying: false,
      editing: false,
      commenting: true,
      formFilling: true,
      pageExtraction: false,
      accessibility: true
    });
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-red-100 rounded-full">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Protect PDF with Password
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Secure your PDF documents with password protection and custom permissions. 
            Control who can view, edit, print, or copy your content.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* File Upload Area */}
          {!file && (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Drop your PDF file here
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
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
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
                <FileText className="w-8 h-8 text-red-500 mr-4" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Password Settings */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Key className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Password Settings</h3>
                  </div>

                  {/* User Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Password (Required)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.userPassword}
                        onChange={(e) => setPasswords({...passwords, userPassword: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                        placeholder="Enter password to open PDF"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Owner Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={passwords.ownerPassword}
                      onChange={(e) => setPasswords({...passwords, ownerPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Password for full permissions"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Allows bypassing restrictions below
                    </p>
                  </div>

                  {/* Encryption Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Encryption Level
                    </label>
                    <select
                      value={encryptionLevel}
                      onChange={(e) => setEncryptionLevel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="40-bit">40-bit RC4 (Basic)</option>
                      <option value="128-bit">128-bit RC4 (Standard)</option>
                      <option value="256-bit">256-bit AES (High Security)</option>
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Settings className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Document Permissions</h3>
                  </div>

                  <div className="space-y-4">
                    {Object.entries({
                      printing: 'Allow Printing',
                      copying: 'Allow Text/Graphics Copying',
                      editing: 'Allow Document Editing',
                      commenting: 'Allow Commenting & Form Fields',
                      formFilling: 'Allow Form Filling',
                      pageExtraction: 'Allow Page Extraction',
                      accessibility: 'Allow Screen Readers'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permissions[key]}
                            onChange={(e) => setPermissions({...permissions, [key]: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  onClick={handleProtect}
                  disabled={isProcessing}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Protecting PDF...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Protect PDF
                    </>
                  )}
                </button>

                {processedFile && (
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Protected PDF
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

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Military-Grade Security</h3>
            <p className="text-gray-600">256-bit AES encryption ensures your documents stay secure</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Settings className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Granular Permissions</h3>
            <p className="text-gray-600">Control exactly what users can do with your PDF</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <Lock className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Password Types</h3>
            <p className="text-gray-600">Separate user and owner passwords for flexible access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectPdf;