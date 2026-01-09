import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import BusinessPage from './pages/BusinessPage';
import ImageToolsPage from './pages/ImageToolsPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AuthCallback from './pages/auth/AuthCallback';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

// Image Tools
import CompressImage from './pages/tools/CompressImage';
import ResizeImage from './pages/tools/ResizeImage';
import CropImage from './pages/tools/CropImage';
import ConvertToJpg from './pages/tools/ConvertToJpg';
import PhotoEditor from './pages/tools/PhotoEditor';
import MemeGenerator from './pages/tools/MemeGenerator';
import RemoveBackground from './pages/tools/RemoveBackground';
import WatermarkImage from './pages/tools/WatermarkImage';
import RotateImage from './pages/tools/RotateImage';
import BlurFace from './pages/tools/BlurFace';
import UpscaleImage from './pages/tools/UpscaleImage';
import CollageMaker from './pages/tools/CollageMaker';
import HtmlToImage from './pages/tools/HtmlToImage';

// PDF Tools - Main Page
import PdfToolsPage from './pages/PdfToolsPage';

// PDF Tools - Individual Components
import ComparePdf from './components/PdfTools/ComparePdf';
import CompressPdf from './components/PdfTools/CompressPdf';
import EditPdf from './components/PdfTools/EditPdf';
import MergePdf from './components/PdfTools/MergePdf';
import OcrPdf from './components/PdfTools/OcrPdf';
import PdfToPdfA from './components/PdfTools/PdfToPdfA';
import PdfToWord from './components/PdfTools/PdfToWord';
import ProtectPdf from './components/PdfTools/ProtectPdf';
import RedactPdf from './components/PdfTools/RedactPdf';
import RepairPdf from './components/PdfTools/RepairPdf';
import RotatePdf from './components/PdfTools/RotatePdf';
import SignPdf from './components/PdfTools/SignPdf';
import SplitPdf from './components/PdfTools/SplitPdf';
import WatermarkPdf from './components/PdfTools/WatermarkPdf';
import PdfToExcel from './components/PdfTools/PdfToExcel';
import ExcelToPdf from './components/PdfTools/ExcelToPdf';
import PdfToPpt from './components/PdfTools/PdfToPpt';
import PptToPdf from './components/PdfTools/PptToPdf';

import PdfToText from './components/PdfTools/PdfToText';
import UnlockPdf from './components/PdfTools/UnlockPdf';
import Workflow from './components/PdfTools/Workflow';

// New PDF Tools
import RemovePages from './components/PdfTools/RemovePages';
import ExtractPages from './components/PdfTools/ExtractPages';
import OrganizePdf from './components/PdfTools/OrganizePdf';
import ScanToPdf from './components/PdfTools/ScanToPdf';
import AddPageNumbers from './components/PdfTools/AddPageNumbers';
import CropPdf from './components/PdfTools/CropPdf';
import JpgToPdf from './components/PdfTools/JpgToPdf';
import HtmlToPdf from './components/PdfTools/HtmlToPdf';
import WordToPdf from './components/PdfTools/WordToPdf';
import BirthdayCelebration from './components/BirthdayCelebration';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Layout>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/image-tools" element={<ImageToolsPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Image Tool Routes */}
            <Route path="/tools/compress" element={<CompressImage />} />
            <Route path="/tools/resize" element={<ResizeImage />} />
            <Route path="/tools/crop" element={<CropImage />} />
            <Route path="/tools/upscale" element={<UpscaleImage />} />
            <Route path="/tools/rotate" element={<RotateImage />} />
            <Route path="/tools/remove-background" element={<RemoveBackground />} />
            <Route path="/tools/blur-face" element={<BlurFace />} />
            <Route path="/tools/convert-to-jpg" element={<ConvertToJpg />} />
            <Route path="/tools/html-to-image" element={<HtmlToImage />} />
            <Route path="/tools/photo-editor" element={<PhotoEditor />} />
            <Route path="/tools/watermark" element={<WatermarkImage />} />
            <Route path="/tools/collage-maker" element={<CollageMaker />} />
            <Route path="/tools/meme-generator" element={<MemeGenerator />} />

            {/* PDF Tools Main Page - This shows all PDF tools */}
            <Route path="/tools/pdf" element={<PdfToolsPage />} />

            {/* Individual PDF Tool Routes */}
            <Route path="/tools/compare-pdf" element={<ComparePdf />} />
            <Route path="/tools/compress-pdf" element={<CompressPdf />} />
            <Route path="/tools/edit-pdf" element={<EditPdf />} />
            <Route path="/tools/merge-pdf" element={<MergePdf />} />
            <Route path="/tools/ocr-pdf" element={<OcrPdf />} />
            <Route path="/tools/pdf-to-pdfa" element={<PdfToPdfA />} />
            <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
            <Route path="/tools/protect-pdf" element={<ProtectPdf />} />
            <Route path="/tools/redact-pdf" element={<RedactPdf />} />
            <Route path="/tools/repair-pdf" element={<RepairPdf />} />
            <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
            <Route path="/tools/sign-pdf" element={<SignPdf />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/watermark-pdf" element={<WatermarkPdf />} />
            <Route path="/tools/pdf-to-excel" element={<PdfToExcel />} />
            <Route path="/tools/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/tools/pdf-to-ppt" element={<PdfToPpt />} />
            <Route path="/tools/ppt-to-pdf" element={<PptToPdf />} />

            <Route path="/tools/pdf-to-text" element={<PdfToText />} />
            <Route path="/tools/unlock-pdf" element={<UnlockPdf />} />
            <Route path="/tools/workflow" element={<Workflow />} />

            {/* New PDF Tool Routes */}
            <Route path="/tools/remove-pages" element={<RemovePages />} />
            <Route path="/tools/extract-pages" element={<ExtractPages />} />
            <Route path="/tools/organize-pdf" element={<OrganizePdf />} />
            <Route path="/tools/scan-to-pdf" element={<ScanToPdf />} />
            <Route path="/tools/add-page-numbers" element={<AddPageNumbers />} />
            <Route path="/tools/crop-pdf" element={<CropPdf />} />
            <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/tools/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/tools/word-to-pdf" element={<WordToPdf />} />

            {/* Birthday Celebration */}
            <Route path="/birthday" element={<BirthdayCelebration />} />

            {/* Fallback Route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;