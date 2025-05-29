import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        JapanGo - 일본어 단어 학습 앱
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '20px auto',
        maxWidth: '600px'
      }}>
        <h2>테스트 화면</h2>
        <p>이 화면이 보인다면 기본 설정이 정상적으로 작동하고 있습니다.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>샘플 단어</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '10px',
            marginTop: '10px'
          }}>
            <div><strong>한자:</strong> 幼い</div>
            <div><strong>읽기:</strong> おさない</div>
            <div><strong>의미:</strong> 어리다</div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}>
            암기 모드
          </button>
          
          <button style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            테스트 모드
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;