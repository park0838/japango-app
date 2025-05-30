import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#1e40af',
  fullScreen = false,
  message = '로딩 중...'
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const spinnerContent = (
    <div className="spinner-container">
      <div 
        className={`spinner ${sizeClasses[size]}`}
        style={{ borderTopColor: color }}
      />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;