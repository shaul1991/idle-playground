import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import '../styles/CountingGame.scss';

interface TileData {
  value: number | null;
  isVisible: boolean;
  position: number;
}

type Difficulty = 'easy' | 'normal' | 'hard';

const CountingGame: React.FC = () => {
  const [board, setBoard] = useState<TileData[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [maxNumber, setMaxNumber] = useState<number>(10);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [lastClickedNumber, setLastClickedNumber] = useState<number>(0);
  const [showStartModal, setShowStartModal] = useState<boolean>(true);
  const [showDifficultyModal, setShowDifficultyModal] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameTime, setGameTime] = useState<number>(0);

  // 난이도별 설정 함수
  const getDifficultySettings = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return { maxNumber: 10, label: '쉬움', description: '1부터 10까지' };
      case 'normal': return { maxNumber: 20, label: '보통', description: '1부터 20까지' };
      case 'hard': return { maxNumber: 30, label: '어려움', description: '1부터 30까지' };
    }
  };

  // 난이도 선택 시작
  const showDifficultySelection = () => {
    setShowStartModal(false);
    setShowDifficultyModal(true);
  };

  // 게임 시작 함수
  const startGame = (difficulty: Difficulty) => {
    const settings = getDifficultySettings(difficulty);
    setMaxNumber(settings.maxNumber);
    setSelectedDifficulty(difficulty);
    setShowDifficultyModal(false);
    initializeBoard();
  };

  // 게임 보드 초기화
  const initializeBoard = useCallback(() => {
    const newBoard: TileData[] = [];
    
    // 16개 위치 생성
    for (let i = 0; i < 16; i++) {
      newBoard.push({
        value: null,
        isVisible: false,
        position: i
      });
    }

    // 항상 1부터 10까지 숫자를 랜덤하게 배치
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const availablePositions = Array.from({ length: 16 }, (_, i) => i);
    
    // 랜덤하게 선택된 위치에 1-10 숫자 배치
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions[randomIndex];
      availablePositions.splice(randomIndex, 1);
      
      newBoard[position] = {
        value: numbers[i],
        isVisible: true,
        position: position
      };
    }

    setBoard(newBoard);
    setCurrentNumber(1);
    setGameStarted(false);
    setGameCompleted(false);
    setLastClickedNumber(0);
    setStartTime(null);
    setElapsedTime(0);
    setGameTime(0);
  }, []);

  // 타일 클릭 핸들러
  const handleTileClick = (tile: TileData) => {
    if (!tile.isVisible || tile.value === null || gameCompleted) return;

    if (tile.value === currentNumber) {
      setLastClickedNumber(tile.value);
      
      if (!gameStarted && tile.value === 1) {
        setGameStarted(true);
        setStartTime(Date.now());
      }

      if (tile.value === maxNumber) {
        setGameCompleted(true);
        setGameTime(elapsedTime);
        setShowCompletionModal(true);
        return;
      }

      // 다음 숫자 생성
      const nextNumber = currentNumber + 1;
      setCurrentNumber(nextNumber);

      // 클릭된 타일 숨기기
      const newBoard = [...board];
      const clickedTileIndex = newBoard.findIndex(t => t.position === tile.position);
      newBoard[clickedTileIndex] = {
        ...newBoard[clickedTileIndex],
        isVisible: false,
        value: null
      };

      // 현재 보드에서 보이는 숫자들 확인
      const visibleNumbers = newBoard
        .filter(t => t.isVisible && t.value !== null)
        .map(t => t.value as number);

      // 남은 숫자들 (아직 게임에서 나오지 않은 숫자들)
      const remainingNumbers = [];
      for (let i = nextNumber; i <= maxNumber; i++) {
        if (!visibleNumbers.includes(i)) {
          remainingNumbers.push(i);
        }
      }

      // 노출되어야 할 타일 개수 계산 (최대 10개, 남은 숫자가 적으면 그만큼)
      const currentVisibleCount = visibleNumbers.length;
      const targetVisibleCount = Math.min(10, currentVisibleCount + remainingNumbers.length);
      const tilesToAdd = targetVisibleCount - currentVisibleCount;

      // 필요한 만큼 새로운 숫자 타일 추가
      const emptyTiles = newBoard.filter(t => !t.isVisible);
      for (let i = 0; i < Math.min(tilesToAdd, remainingNumbers.length, emptyTiles.length); i++) {
        const randomEmptyIndex = Math.floor(Math.random() * emptyTiles.length);
        const randomEmptyTile = emptyTiles[randomEmptyIndex];
        const emptyTileIndex = newBoard.findIndex(t => t.position === randomEmptyTile.position);
        
        newBoard[emptyTileIndex] = {
          ...newBoard[emptyTileIndex],
          value: remainingNumbers[i],
          isVisible: true
        };
        
        // 사용된 빈 타일을 배열에서 제거
        emptyTiles.splice(randomEmptyIndex, 1);
      }

      setBoard(newBoard);
    }
  };

  useEffect(() => {
    if (!showStartModal && !showDifficultyModal) {
      initializeBoard();
    }
  }, [initializeBoard, showStartModal, showDifficultyModal]);

  // 모달이 열려있을 때 body 스크롤 방지
  useEffect(() => {
    const isAnyModalOpen = showStartModal || showDifficultyModal || showCompletionModal;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showStartModal, showDifficultyModal, showCompletionModal]);

  // 타이머 useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (startTime && !gameCompleted) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10); // 0.01초마다 업데이트
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, gameCompleted]);

  // 시간 포맷팅 함수
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}.${ms.toString().padStart(2, '0')}초`;
    }
  };

  const resetGame = () => {
    setShowStartModal(true);
    setShowDifficultyModal(false);
    setShowCompletionModal(false);
    setSelectedDifficulty(null);
    setStartTime(null);
    setElapsedTime(0);
    setGameTime(0);
  };

  const playAgain = () => {
    setShowCompletionModal(false);
    setShowStartModal(true);
    setShowDifficultyModal(false);
    setSelectedDifficulty(null);
    setGameCompleted(false);
    setStartTime(null);
    setElapsedTime(0);
    setGameTime(0);
  };

  const goToMainPage = () => {
    window.history.back();
  };

  return (
    <Layout 
      title="🔢 숫자 놀이"
      headerActions={
        <button 
          className="settings-button"
          onClick={resetGame}
          aria-label="설정 변경"
        >
          ⚙️
        </button>
      }
    >
      <div className="counting-game">
        {/* 시작 모달 */}
        {showStartModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>🔢 숫자 놀이 게임</h2>
              <p>원하는 난이도를 선택해주세요!</p>
              <div className="game-rules">
                <h3>게임 방법</h3>
                <ul>
                  <li>1부터 순서대로 숫자를 클릭하세요</li>
                  <li>목표 숫자까지 모든 숫자를 찾으면 게임 완료!</li>
                  <li>항상 최대 10개 타일이 보드에 유지됩니다</li>
                  <li>게임 후반부에는 남은 숫자만큼 타일이 줄어듭니다</li>
                </ul>
              </div>
              <button className="start-button" onClick={showDifficultySelection}>
                게임 시작! 🎮
              </button>
            </div>
          </div>
        )}

        {/* 난이도 선택 모달 */}
        {showDifficultyModal && (
          <div className="modal-overlay">
            <div className="modal-content" tabIndex={-1}>
              <h2>난이도 선택</h2>
              <p>원하는 난이도를 선택해주세요!</p>
              <div className="difficulty-buttons">
                <button 
                  className="difficulty-button easy"
                  onClick={() => startGame('easy')}
                  onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
                  onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
                >
                  <div className="difficulty-label">🌱 쉬움</div>
                  <div className="difficulty-range">1~10</div>
                </button>
                <button 
                  className="difficulty-button normal"
                  onClick={() => startGame('normal')}
                  onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
                  onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
                >
                  <div className="difficulty-label">🎯 보통</div>
                  <div className="difficulty-range">1~20</div>
                </button>
                <button 
                  className="difficulty-button hard"
                  onClick={() => startGame('hard')}
                  onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
                  onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
                >
                  <div className="difficulty-label">🔥 어려움</div>
                  <div className="difficulty-range">1~30</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {showCompletionModal && (
          <div className="modal-overlay">
            <div className="modal-content completion-modal">
              <h2>🎉 축하합니다!</h2>
              <div className="completion-stats">
                <p className="difficulty-completed">
                  {selectedDifficulty && getDifficultySettings(selectedDifficulty).label} 난이도 완주!
                </p>
                <p className="range-completed">1부터 {maxNumber}까지 모두 찾았어요!</p>
                <div className="final-time-display">
                  <span className="time-label">완주 시간</span>
                  <span className="time-value-large">{formatTime(gameTime)}</span>
                </div>
              </div>
              <div className="completion-buttons">
                <button className="play-again-button" onClick={playAgain}>
                  🔄 다시하기
                </button>
                <button className="other-games-button" onClick={goToMainPage}>
                  🎮 다른 놀이보기
                </button>
              </div>
            </div>
          </div>
        )}

      {!showStartModal && !showDifficultyModal && (
        <div className="game-info">
          <div className="game-progress">
            <p>목표: 1부터 <span className="max-number">{maxNumber}</span>까지</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(lastClickedNumber / maxNumber) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="current-info">
            <div className="game-status">
              {!gameStarted ? (
                <p><span className="current-number">1</span>번 타일을 클릭해서 게임을 시작하세요!</p>
              ) : gameCompleted ? (
                <p className="completed">🎉 축하합니다! {maxNumber}까지 모두 찾았어요!</p>
              ) : (
                <p>찾는 숫자: <span className="current-number">{currentNumber}</span></p>
              )}
            </div>
            <div className="timer-section">
              {!gameStarted ? (
                <p className="timer-display">⏱️ 준비중...</p>
              ) : gameCompleted ? (
                <p className="final-time">⏱️ 완주 시간: <span className="time-value">{formatTime(gameTime)}</span></p>
              ) : (
                <p className="timer-display">⏱️ {formatTime(elapsedTime)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!showStartModal && !showDifficultyModal && (
        <>
          <div className="game-board">
            {board.map((tile, index) => (
              <div
                key={index}
                className={`tile ${tile.isVisible ? 'visible' : 'empty'} ${
                  tile.value === currentNumber ? 'target' : ''
                }`}
                onClick={() => handleTileClick(tile)}
              >
                {tile.isVisible && tile.value}
              </div>
            ))}
          </div>

          <div className="game-instructions">
            <h3>게임 방법</h3>
            <ul>
              <li>1부터 순서대로 숫자를 클릭하세요</li>
              <li>{maxNumber}까지 모든 숫자를 찾으면 게임 완료!</li>
            </ul>
          </div>
        </>
      )}
      </div>
    </Layout>
  );
};

export default CountingGame; 