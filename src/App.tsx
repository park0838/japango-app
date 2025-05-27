import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import StudyPage from './pages/StudyPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/study" replace />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </main>
      </div>
      
      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .app-content {
          flex: 1;
        }
      `}</style>
    </Router>
  );
}

export default App;