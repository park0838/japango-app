import { useState } from 'react';
import { getAllWeeks, getVocabByWeek } from '../data/vocabData';
import VocabularyList from '../components/VocabularyList';

const StudyPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [showVocabList, setShowVocabList] = useState(false);

  const weeks = getAllWeeks();
  const currentVocabList = selectedWeek ? getVocabByWeek(selectedWeek) : [];

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week);
    setShowVocabList(true);
  };

  const handleCloseVocabList = () => {
    setShowVocabList(false);
    setSelectedWeek(null);
  };

  if (showVocabList && currentVocabList.length > 0) {
    return (
      <VocabularyList 
        vocabList={currentVocabList}
        onClose={handleCloseVocabList}
      />
    );
  }

  return (
    <div className="study-page">
      <div className="page-container">
        <h1>암기 모드</h1>
        <p>학습할 주차를 선택하세요</p>
        
        <div className="week-grid">
          {weeks.map(week => (
            <button
              key={week}
              className="week-card"
              onClick={() => handleWeekSelect(week)}
            >
              <h3>{week}주차</h3>
              <p>{getVocabByWeek(week).length}개 단어</p>
            </button>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .study-page {
          min-height: calc(100vh - 80px);
          padding: var(--spacing-6);
          background-color: var(--background);
        }
        
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        
        .page-container h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--font-color);
          margin-bottom: var(--spacing-4);
        }
        
        .page-container p {
          font-size: 1.2rem;
          color: var(--font-color-muted);
          margin-bottom: var(--spacing-8);
        }
        
        .week-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-4);
          margin-top: var(--spacing-6);
        }
        
        .week-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: var(--spacing-6);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          box-shadow: var(--shadow-md);
        }
        
        .week-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }
        
        .week-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary);
          margin: 0 0 var(--spacing-2) 0;
        }
        
        .week-card p {
          font-size: 1rem;
          color: var(--font-color-muted);
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .study-page {
            padding: var(--spacing-4);
          }
          
          .page-container h1 {
            font-size: 2rem;
          }
          
          .week-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StudyPage;