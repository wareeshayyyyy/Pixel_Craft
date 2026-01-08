import React from 'react';
import { Link } from 'react-router-dom';

const PdfCategories = () => {
  const categories = [
    {
      name: "📁 Organize PDF",
      tools: [
        { name: "🔗 Merge PDF", path: "/tools/merge-pdf" },
        { name: "✂️ Split PDF", path: "/tools/split-pdf" },
        { name: "🗑️ Remove Pages", path: "/tools/remove-pages" },
        { name: "📄 Extract Pages", path: "/tools/extract-pages" },
        { name: "📋 Organize PDF", path: "/tools/organize-pdf" },
        { name: "📷 Scan to PDF", path: "/tools/scan-to-pdf" },
      ],
    },
    {
      name: "⚡ Optimize PDF",
      tools: [
        { name: "🗜️ Compress PDF", path: "/tools/compress-pdf" },
        { name: "🔧 Repair PDF", path: "/tools/repair-pdf" },
        { name: "🔍 OCR PDF", path: "/tools/ocr-pdf" },
      ],
    },
    {
      name: "➡️ Convert to PDF",
      tools: [
        { name: "🖼️ JPG to PDF", path: "/tools/jpg-to-pdf" },
        { name: "📝 WORD to PDF", path: "/tools/word-to-pdf" },
        { name: "📊 POWERPOINT to PDF", path: "/tools/ppt-to-pdf" },
        { name: "📈 EXCEL to PDF", path: "/tools/excel-to-pdf" },
        { name: "🌐 HTML to PDF", path: "/tools/html-to-pdf" },
      ],
    },
    {
      name: "⬅️ Convert from PDF",
      tools: [
        { name: "📸 PDF to JPG", path: "/tools/pdf-to-jpg" },
        { name: "📝 PDF to WORD", path: "/tools/pdf-to-word" },
        { name: "📊 PDF to POWERPOINT", path: "/tools/pdf-to-ppt" },
        { name: "📈 PDF to EXCEL", path: "/tools/pdf-to-excel" },
        { name: "📋 PDF to PDF/A", path: "/tools/pdf-to-pdfa" },
      ],
    },
    {
      name: "✏️ Edit PDF",
      tools: [
        { name: "🔄 Rotate PDF", path: "/tools/rotate-pdf" },
        { name: "⚡ Workflow", path: "/tools/workflow" },
        { name: "🔢 Add Page Numbers", path: "/tools/add-page-numbers" },
        { name: "🏷️ Add Watermark", path: "/tools/watermark-pdf" },
        { name: "✂️ Crop PDF", path: "/tools/crop-pdf" },
        { name: "📝 Edit PDF", path: "/tools/edit-pdf" },
      ],
    },
    {
      name: "🛠️ PDF Tools",
      tools: [
        { name: "👁️ PDF to Text", path: "/tools/pdf-to-text" },
        { name: "🔍 Compare PDF", path: "/tools/compare-pdf" },
        { name: "🔒 Protect PDF", path: "/tools/protect-pdf" },
        { name: "🔓 Unlock PDF", path: "/tools/unlock-pdf" },
        { name: "✍️ Sign PDF", path: "/tools/sign-pdf" },
        { name: "🖍️ Redact PDF", path: "/tools/redact-pdf" },
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