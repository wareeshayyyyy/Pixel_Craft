import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import ToolsPage from '../pages/ToolsPage';
import BusinessPage from '../pages/BusinessPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';

// Image Tools
import ImageToolsContent from '../pages/tools/ImageToolsContent';
import ResizeImage from '../pages/tools/ResizeImage';
import CompressImage from '../pages/tools/CompressImage';
import RemoveBackground from '../pages/tools/RemoveBackground';
import UpscaleImage from '../pages/tools/UpscaleImage';
import CropImage from '../pages/tools/CropImage';
import RotateImage from '../pages/tools/RotateImage';
import WatermarkImage from '../pages/tools/WatermarkImage';
import BlurFace from '../pages/tools/BlurFace';
import ConvertToJpg from '../pages/tools/ConvertToJpg';
import HtmlToImage from '../pages/tools/HtmlToImage';
import MemeGenerator from '../pages/tools/MemeGenerator';
import PhotoEditor from '../pages/tools/PhotoEditor';
import CollageMaker from '../pages/tools/CollageMaker';

// PDF Tools
import PdfToolsPage from '../pages/PdfToolsPage';
import ComparePdf from '../components/PdfTools/ComparePdf';
import CompressPdf from '../components/PdfTools/CompressPdf';
import EditPdf from '../components/PdfTools/EditPdf';
import MergePdf from '../components/PdfTools/MergePdf';
import OcrPdf from '../components/PdfTools/OcrPdf';
import PdfToPdfA from '../components/PdfTools/PdfToPdfA';
import PdfToWord from '../components/PdfTools/PdfToWord';
import ProtectPdf from '../components/PdfTools/ProtectPdf';
import RedactPdf from '../components/PdfTools/RedactPdf';
import RepairPdf from '../components/PdfTools/RepairPdf';
import RotatePdf from '../components/PdfTools/RotatePdf';
import SignPdf from '../components/PdfTools/SignPdf';
import SplitPdf from '../components/PdfTools/SplitPdf';
import WatermarkPdf from '../components/PdfTools/WatermarkPdf';
import PdfToExcel from '../components/PdfTools/PdfToExcel';
import ExcelToPdf from '../components/PdfTools/ExcelToPdf';
import PdfToPpt from '../components/PdfTools/PdfToPpt';
import PptToPdf from '../components/PdfTools/PptToPdf';
import PdfToImage from '../components/PdfTools/PdfToImage';
import PdfToText from '../components/PdfTools/PdfToText';
import UnlockPdf from '../components/PdfTools/UnlockPdf';
import Workflow from '../components/PdfTools/Workflow';
import RemovePages from '../components/PdfTools/RemovePages';
import ExtractPages from '../components/PdfTools/ExtractPages';
import OrganizePdf from '../components/PdfTools/OrganizePdf';
import ScanToPdf from '../components/PdfTools/ScanToPdf';
import AddPageNumbers from '../components/PdfTools/AddPageNumbers';
import CropPdf from '../components/PdfTools/CropPdf';
import JpgToPdf from '../components/PdfTools/JpgToPdf';
import HtmlToPdf from '../components/PdfTools/HtmlToPdf';
import WordToPdf from '../components/PdfTools/WordToPdf';
import PowerpointToPdf from '../components/PdfTools/PowerpointToPdf';

// PDF Components
import PdfHeroSection from '../components/PdfTools/PdfHeroSection';
import PdfCategories from '../components/PdfTools/PdfCategories';
import ToolGrid from '../components/ToolGrid';
import FileUpload from '../components/FileUpload';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Pages */}
          <Route index element={<HomePage />} />
          <Route path="business" element={<BusinessPage />} />
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/signup" element={<SignupPage />} />
          
          {/* Tools Section */}
          <Route path="tools" element={<ToolsPage />}>
            {/* Image Tools - Default View */}
            <Route index element={<ImageToolsContent />} />
            
            {/* Image Optimization Tools */}
            <Route path="resize" element={<ResizeImage />} />
            <Route path="compress" element={<CompressImage />} />
            <Route path="upscale" element={<UpscaleImage />} />
            <Route path="remove-background" element={<RemoveBackground />} />
            
            {/* Image Editing Tools */}
            <Route path="crop" element={<CropImage />} />
            <Route path="rotate" element={<RotateImage />} />
            <Route path="watermark" element={<WatermarkImage />} />
            <Route path="blur-face" element={<BlurFace />} />
            
            {/* Conversion Tools */}
            <Route path="convert-to-jpg" element={<ConvertToJpg />} />
            <Route path="html-to-image" element={<HtmlToImage />} />
            
            {/* Creative Tools */}
            <Route path="meme-generator" element={<MemeGenerator />} />
            <Route path="photo-editor" element={<PhotoEditor />} />
            <Route path="collage-maker" element={<CollageMaker />} />
          </Route>

          {/* PDF Tools Section */}
          <Route path="tools" element={<PdfToolsPage />}>
            <Route index element={<PdfHeroSection />} />
            
            {/* PDF Organization */}
            <Route path="merge" element={<MergePdf />} />
            <Route path="split" element={<SplitPdf />} />
            <Route path="organize" element={<OrganizePdf />} />
            <Route path="remove-pages" element={<RemovePages />} />
            <Route path="extract-pages" element={<ExtractPages />} />
            <Route path="rotate" element={<RotatePdf />} />
            <Route path="crop" element={<CropPdf />} />
            <Route path="add-page-numbers" element={<AddPageNumbers />} />
            
            {/* PDF Optimization */}
            <Route path="compress" element={<CompressPdf />} />
            <Route path="repair" element={<RepairPdf />} />
            <Route path="ocr" element={<OcrPdf />} />
            <Route path="to-pdfa" element={<PdfToPdfA />} />
            
            {/* PDF Conversion */}
            <Route path="to-word" element={<PdfToWord />} />
            <Route path="word-to-pdf" element={<WordToPdf />} />
            <Route path="to-jpg" element={<PdfToImage />} />
            <Route path="jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="html-to-pdf" element={<HtmlToPdf />} />
            <Route path="powerpoint-to-pdf" element={<PowerpointToPdf />} />
            <Route path="scan-to-pdf" element={<ScanToPdf />} />
            <Route path="to-excel" element={<PdfToExcel />} />
            <Route path="excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="to-ppt" element={<PdfToPpt />} />
            <Route path="ppt-to-pdf" element={<PptToPdf />} />
            <Route path="to-text" element={<PdfToText />} />
            
            {/* PDF Editing */}
            <Route path="edit" element={<EditPdf />} />
            <Route path="watermark" element={<WatermarkPdf />} />
            <Route path="compare" element={<ComparePdf />} />
            
            {/* PDF Security */}
            <Route path="protect" element={<ProtectPdf />} />
            <Route path="unlock" element={<UnlockPdf />} />
            <Route path="sign" element={<SignPdf />} />
            <Route path="redact" element={<RedactPdf />} />
            
            {/* Advanced PDF */}
            <Route path="workflow" element={<Workflow />} />
          </Route>

          {/* 404 Page - Keep this last */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;