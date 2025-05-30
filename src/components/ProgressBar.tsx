import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'medium',
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`progress-bar-wrapper progress-bar-${size}`}>
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label && <span className="progress-bar-label">{label}</span>}
          {showPercentage && (
            <span className="progress-bar-percentage">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill progress-bar-${color} ${animated ? 'progress-bar-animated' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 0 && animated && <div className="progress-bar-glow" />}
        </div>
      </div>
    </div>
  );
};

// 원형 프로그레스 바 컴포넌트
export const CircularProgress: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'medium'
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = size === 'small' ? 30 : size === 'large' ? 60 : 45;
  const strokeWidth = size === 'small' ? 4 : size === 'large' ? 8 : 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`circular-progress circular-progress-${size}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="circular-progress-svg"
      >
        <circle
          className="circular-progress-track"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`circular-progress-fill circular-progress-${color}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="circular-progress-content">
        {showPercentage && (
          <span className="circular-progress-percentage">{Math.round(percentage)}%</span>
        )}
        {label && <span className="circular-progress-label">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressBar;