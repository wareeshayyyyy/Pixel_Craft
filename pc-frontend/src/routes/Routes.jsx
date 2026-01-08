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
import PdfToHtml from '../components/PdfTools/PdfToHtml';

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
import PptToPdf from '../components/PdfTools/PptToPdf';

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
          
          {/* Tools Section - Combined routing */}
          <Route path="tools" element={<ToolsPage />} />
          
          {/* Individual Image Tools */}
          <Route path="tools/resize" element={<ResizeImage />} />
          <Route path="tools/compress" element={<CompressImage />} />
          <Route path="tools/upscale" element={<UpscaleImage />} />
          <Route path="tools/remove-background" element={<RemoveBackground />} />
          <Route path="tools/crop" element={<CropImage />} />
          <Route path="tools/rotate" element={<RotateImage />} />
          <Route path="tools/watermark" element={<WatermarkImage />} />
          <Route path="tools/blur-face" element={<BlurFace />} />
          <Route path="tools/convert-to-jpg" element={<ConvertToJpg />} />
          <Route path="tools/html-to-image" element={<HtmlToImage />} />
          <Route path="tools/meme-generator" element={<MemeGenerator />} />
          <Route path="tools/photo-editor" element={<PhotoEditor />} />
          <Route path="tools/collage-maker" element={<CollageMaker />} />

          {/* PDF Tools Page */}
          <Route path="pdf-tools" element={<PdfToolsPage />} />
          
          {/* PDF Tools Routes - These should match your PdfCategories paths */}
          <Route path="tools/pdf/merge" element={<MergePdf />} />
          <Route path="tools/pdf/split" element={<SplitPdf />} />
          <Route path="tools/pdf/organize" element={<OrganizePdf />} />
          <Route path="tools/pdf/remove-pages" element={<RemovePages />} />
          <Route path="tools/pdf/extract-pages" element={<ExtractPages />} />
          <Route path="tools/pdf/rotate" element={<RotatePdf />} />
          <Route path="tools/pdf/crop" element={<CropPdf />} />
          <Route path="tools/pdf/add-page-numbers" element={<AddPageNumbers />} />
          <Route path="tools/pdf/scan-to-pdf" element={<ScanToPdf />} />
          
          {/* PDF Optimization */}
          <Route path="tools/pdf/compress" element={<CompressPdf />} />
          <Route path="tools/pdf/repair" element={<RepairPdf />} />
          <Route path="tools/pdf/ocr" element={<OcrPdf />} />
          
          {/* PDF Conversion - To PDF */}
          <Route path="tools/pdf/jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="tools/pdf/word-to-pdf" element={<WordToPdf />} />
          <Route path="tools/pdf/powerpoint-to-pdf" element={<PptToPdf />} />
          <Route path="tools/pdf/excel-to-pdf" element={<ExcelToPdf />} />
          <Route path="tools/pdf/html-to-pdf" element={<HtmlToPdf />} />
          
          {/* PDF Conversion - From PDF */}

          <Route path="tools/pdf/to-word" element={<PdfToWord />} />
          <Route path="tools/pdf/to-ppt" element={<PdfToPpt />} />
          <Route path="tools/pdf/to-excel" element={<PdfToExcel />} />
          <Route path="tools/pdf/to-html" element={<PdfToHtml />} />
          <Route path="tools/pdf/to-pdfa" element={<PdfToPdfA />} />
          
          {/* PDF Editing */}
          <Route path="tools/pdf/watermark" element={<WatermarkPdf />} />
          <Route path="tools/pdf/edit" element={<EditPdf />} />
          
          {/* PDF Security & Tools */}
          <Route path="tools/pdf/compare" element={<ComparePdf />} />
          <Route path="tools/pdf/protect" element={<ProtectPdf />} />
          <Route path="tools/pdf/unlock" element={<UnlockPdf />} />
          <Route path="tools/pdf/sign" element={<SignPdf />} />
          <Route path="tools/pdf/redact" element={<RedactPdf />} />
          <Route path="tools/pdf/workflow" element={<Workflow />} />

          {/* Alternative routes for direct PDF tools access (from standalone PDF Tools page) */}
          <Route path="tools/merge-pdf" element={<MergePdf />} />
          <Route path="tools/split-pdf" element={<SplitPdf />} />
          <Route path="tools/compress-pdf" element={<CompressPdf />} />
          <Route path="tools/organize-pdf" element={<OrganizePdf />} />
          <Route path="tools/repair-pdf" element={<RepairPdf />} />
          <Route path="tools/ocr-pdf" element={<OcrPdf />} />
          <Route path="tools/protect-pdf" element={<ProtectPdf />} />
          <Route path="tools/unlock-pdf" element={<UnlockPdf />} />
          <Route path="tools/sign-pdf" element={<SignPdf />} />
          <Route path="tools/watermark-pdf" element={<WatermarkPdf />} />
          <Route path="tools/edit-pdf" element={<EditPdf />} />
          <Route path="tools/compare-pdf" element={<ComparePdf />} />
          <Route path="tools/redact-pdf" element={<RedactPdf />} />

          {/* 404 Page - Keep this last */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;