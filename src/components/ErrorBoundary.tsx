import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isOnline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isOnline: navigator.onLine
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isOnline: navigator.onLine };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // 페이지 새로고침
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">😵</div>
            <h1 className="error-title">앗! 문제가 발생했습니다</h1>
            
            {!this.state.isOnline && (
              <div className="offline-warning">
                <span className="offline-icon">📡</span>
                <p>현재 오프라인 상태입니다. 인터넷 연결을 확인해주세요.</p>
              </div>
            )}
            
            <p className="error-description">
              예상치 못한 오류가 발생했습니다. 
              새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>오류 상세 정보</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            
            <div className="error-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={this.handleReset}
              >
                🔄 페이지 새로고침
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => window.location.href = '/'}
              >
                🏠 홈으로 돌아가기
              </button>
            </div>
            
            <div className="error-tips">
              <h3>도움이 될 수 있는 방법들:</h3>
              <ul>
                <li>브라우저 캐시를 지우고 다시 시도해보세요</li>
                <li>다른 브라우저에서 접속해보세요</li>
                <li>시크릿/프라이빗 모드로 접속해보세요</li>
                <li>문제가 계속되면 잠시 후 다시 방문해주세요</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
