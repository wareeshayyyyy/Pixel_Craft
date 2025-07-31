import { useEffect, useState } from 'react';

const ProcessingStatus = ({ tasks, onComplete }) => {
  const [progress, setProgress] = useState({});
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const totalTasks = tasks.length;
    let completedTasks = 0;
    
    const updateProgress = () => {
      tasks.forEach((task, index) => {
        setTimeout(() => {
          const newProgress = { ...progress };
          newProgress[index] = (newProgress[index] || 0) + 10;
          
          if (newProgress[index] >= 100) {
            completedTasks++;
            if (completedTasks === totalTasks) {
              setTimeout(() => onComplete(), 500);
            }
          }
          
          setProgress(newProgress);
          setCompleted(completedTasks);
          updateProgress();
        }, 300 * (index + 1));
      });
    };
    
    updateProgress();
  }, []);

  return (
    <div className="processing-status">
      <h3>Processing your files</h3>
      <div className="progress-overview">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(completed / tasks.length) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          {completed} of {tasks.length} tasks completed
        </div>
      </div>
      
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={index} className="task-item">
            <div className="task-name">{task.name}</div>
            <div className="task-progress">
              <div 
                className="task-progress-bar"
                style={{ width: `${progress[index] || 0}%` }}
              />
              <span>{progress[index] || 0}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingStatus;