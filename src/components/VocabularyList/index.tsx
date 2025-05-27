import React, { useState, useMemo } from 'react';
import { VocabItem } from '../../types';
import { playPronunciation } from '../../services/audioService';
import './styles.css';

interface VocabularyListProps {
  vocabList: VocabItem[];
  onClose: () => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ vocabList, onClose }) => {
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 단어 목록 필터링
  const filteredVocabList = useMemo(() => {
    let filtered = [...vocabList];

    // 주차별 필터링
    if (selectedWeek !== 'all') {
      const weekNumber = parseInt(selectedWeek);
      filtered = filtered.filter(item => item.week === weekNumber);
    }

    // 검색어로 필터링
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.kanji.toLowerCase().includes(term) ||
          item.korean.toLowerCase().includes(term) ||
          item.hiragana.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [vocabList, selectedWeek, searchTerm]);

  // 단어 발음 재생
  const handlePlayPronunciation = (item: VocabItem) => {
    playPronunciation(item.hiragana);
  };

  // 주차 옵션 생성
  const weekOptions = useMemo(() => {
    const weeks = new Set(vocabList.map(item => item.week));
    return Array.from(weeks).sort((a, b) => a - b);
  }, [vocabList]);

  return (
    <div className="vocabulary-list-container">
      <div className="vocabulary-list-header">
        <h2>단어 목록</h2>
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
      </div>

      <div className="vocabulary-list-filters">
        <div className="filter-group">
          <label htmlFor="week-select">주차</label>
          <select
            id="week-select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="week-select"
          >
            <option value="all">전체</option>
            {weekOptions.map((week) => (
              <option key={week} value={week.toString()}>
                {week}주차
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-input">검색</label>
          <input
            id="search-input"
            type="text"
            placeholder="단어, 의미, 읽기 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="vocabulary-list">
        {filteredVocabList.length > 0 ? (
          <table className="vocab-table">
            <thead>
              <tr>
                <th>주차</th>
                <th>단어</th>
                <th>읽기</th>
                <th>의미</th>
                <th>발음</th>
              </tr>
            </thead>
            <tbody>
              {filteredVocabList.map((item, index) => (
                <tr key={`${item.kanji}-${index}`} className="vocab-row">
                  <td className="vocab-week">{item.week}주차</td>
                  <td className="vocab-word">{item.kanji}</td>
                  <td className="vocab-reading">{item.hiragana}</td>
                  <td className="vocab-meaning">{item.korean}</td>
                  <td>
                    <button
                      className="pronunciation-button"
                      onClick={() => handlePlayPronunciation(item)}
                    >
                      🔊
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">검색 결과가 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default VocabularyList;