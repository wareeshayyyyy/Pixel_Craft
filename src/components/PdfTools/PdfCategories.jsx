import React from 'react';
import { Link } from 'react-router-dom';

const PdfCategories = () => {
  const categories = [
    {
      name: "Organize PDF",
      tools: [
        { name: "Merge PDF", path: "/tools/pdf/merge" },
        { name: "Split PDF", path: "/tools/pdf/split" },
        { name: "Remove Pages", path: "/tools/pdf/remove-pages" },
        { name: "Extract Pages", path: "/tools/pdf/extract-pages" },
        { name: "Organize PDF", path: "/tools/pdf/organize" },
        { name: "Scan to PDF", path: "/tools/pdf/scan-to-pdf" },
      ],
    },
    {
      name: "Optimize PDF",
      tools: [
        { name: "Compress PDF", path: "/tools/pdf/compress" },
        { name: "Repair PDF", path: "/tools/pdf/repair" },
        { name: "OCR PDF", path: "/tools/pdf/ocr" },
      ],
    },
    {
      name: "Convert to PDF",
      tools: [
        { name: "JPG to PDF", path: "/tools/pdf/jpg-to-pdf" },
        { name: "WORD to PDF", path: "/tools/pdf/word-to-pdf" },
        { name: "POWERPOINT to PDF", path: "/tools/pdf/powerpoint-to-pdf" },
        { name: "EXCEL to PDF", path: "/tools/pdf/excel-to-pdf" },
        { name: "HTML to PDF", path: "/tools/pdf/html-to-pdf" },
      ],
    },
    {
      name: "Convert from PDF",
      tools: [
        { name: "PDF to JPG", path: "/tools/pdf/to-jpg" },
        { name: "PDF to WORD", path: "/tools/pdf/to-word" },
        { name: "PDF to POWERPOINT", path: "/tools/pdf/to-ppt" },
        { name: "PDF to EXCEL", path: "/tools/pdf/to-excel" },
        { name: "PDF to PDF/A", path: "/tools/pdf/to-pdfa" },
      ],
    },
    {
      name: "Edit PDF",
      tools: [
        { name: "Rotate PDF", path: "/tools/pdf/rotate" },
        { name: "Add Page Numbers", path: "/tools/pdf/add-page-numbers" },
        { name: "Add Watermark", path: "/tools/pdf/watermark" },
        { name: "Crop PDF", path: "/tools/pdf/crop" },
        { name: "Edit PDF", path: "/tools/pdf/edit" },
      ],
    },
    {
      name: "PDF Tools",
      tools: [
        { name: "Open PDF", path: "/tools/pdf/open" },
        { name: "Compare PDF", path: "/tools/pdf/compare" },
        { name: "Protect PDF", path: "/tools/pdf/protect" },
        { name: "Unlock PDF", path: "/tools/pdf/unlock" },
        { name: "Sign PDF", path: "/tools/pdf/sign" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.name} className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.tools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="block p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-800">{tool.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PdfCategories;