import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfViewer = ({ file, scale = 1.0, onTextSelect, onAreaSelect }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdf, setPdf] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      if (!file) return;
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const loadedPdf = await loadingTask.promise;
        
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [file]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;
      
      try {
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
      } catch (error) {
        console.error("Error rendering page:", error);
      }
    };

    renderPage();
  }, [pdf, currentPage, scale]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < numPages) setCurrentPage(currentPage + 1);
  };

  const handleCanvasClick = (e) => {
    if (!onAreaSelect) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    onAreaSelect({
      page: currentPage,
      x,
      y,
    });
  };

  return (
    <div className="pdf-viewer-container">
      {pdf && (
        <div className="pdf-controls">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {numPages}</span>
          <button 
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
          >
            Next
          </button>
        </div>
      )}
      
      <div className="pdf-canvas-wrapper">
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
        />
      </div>
      
      {!pdf && file && (
        <div className="loading-pdf">Loading PDF...</div>
      )}
    </div>
  );
};

export default PdfViewer;