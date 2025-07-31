import { useEffect, useState } from "react";

const PdfResults = ({ operation, result, onReset, onDownload }) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsProcessing(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [isProcessing]);

  return (
    <div className="pdf-results-container">
      {isProcessing ? (
        <div className="processing-section">
          <h2>Processing your {operation}...</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>{progress}% complete</p>
        </div>
      ) : (
        <div className="results-section">
          <div className="success-message">
            <svg viewBox="0 0 24 24" className="success-icon">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <h2>{operation} completed successfully!</h2>
          </div>
          
          <div className="result-actions">
            <button 
              onClick={onDownload}
              className="download-button"
            >
              Download Result
            </button>
            <button 
              onClick={onReset}
              className="secondary-button"
            >
              Process Another File
            </button>
          </div>
          
          {result?.fileSize && (
            <div className="result-info">
              <p><strong>Original Size:</strong> {result.originalSize} MB</p>
              <p><strong>New Size:</strong> {result.fileSize} MB</p>
              <p><strong>Reduction:</strong> {result.reduction}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfResults;