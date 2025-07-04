import React, { useState, useEffect, useCallback } from 'react';
import '../styles/CountingGame.css';

interface TileData {
  value: number | null;
  isVisible: boolean;
  position: number;
}

const CountingGame: React.FC = () => {
  const [board, setBoard] = useState<TileData[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [maxNumber, setMaxNumber] = useState<number>(10);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [lastClickedNumber, setLastClickedNumber] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [inputMaxNumber, setInputMaxNumber] = useState<string>('10');

  // 게임 시작 함수
  const startGame = () => {
    const num = parseInt(inputMaxNumber);
    if (num < 3 || num > 16) {
      alert('3부터 16까지의 숫자를 입력해주세요!');
      return;
    }
    
    setMaxNumber(num);
    setShowModal(false);
    initializeBoard(num);
  };

  // 게임 보드 초기화
  const initializeBoard = useCallback((targetMaxNumber?: number) => {
    const currentMaxNumber = targetMaxNumber || maxNumber;
    const newBoard: TileData[] = [];
    
    // 16개 위치 생성
    for (let i = 0; i < 16; i++) {
      newBoard.push({
        value: null,
        isVisible: false,
        position: i
      });
    }

    // 1부터 maxNumber까지 숫자를 랜덤하게 배치
    const displayCount = Math.min(currentMaxNumber, 10); // 최대 10개까지만 표시
    const numbers = Array.from({ length: displayCount }, (_, i) => i + 1);
    const availablePositions = Array.from({ length: 16 }, (_, i) => i);
    
    // 랜덤하게 선택된 위치에 숫자 배치
    for (let i = 0; i < displayCount; i++) {
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
  }, [maxNumber]);

  // 타일 클릭 핸들러
  const handleTileClick = (tile: TileData) => {
    if (!tile.isVisible || tile.value === null || gameCompleted) return;

    if (tile.value === currentNumber) {
      setLastClickedNumber(tile.value);
      
      if (!gameStarted && tile.value === 1) {
        setGameStarted(true);
      }

      if (tile.value === maxNumber) {
        setGameCompleted(true);
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

      // 다음 숫자가 maxNumber 이하이면 빈 타일에 배치
      if (nextNumber <= maxNumber) {
        const emptyTiles = newBoard.filter(t => !t.isVisible);
        if (emptyTiles.length > 0) {
          const randomEmptyTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
          const emptyTileIndex = newBoard.findIndex(t => t.position === randomEmptyTile.position);
          newBoard[emptyTileIndex] = {
            ...newBoard[emptyTileIndex],
            value: nextNumber,
            isVisible: true
          };
        }
      }

      setBoard(newBoard);
    }
  };

  useEffect(() => {
    if (!showModal) {
      initializeBoard();
    }
  }, [initializeBoard, showModal]);

  const resetGame = () => {
    setShowModal(true);
    setInputMaxNumber(maxNumber.toString());
  };

  return (
    <div className="counting-game">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🔢 숫자 놀이 설정</h2>
            <p>몇까지 숫자를 찾고 싶나요?</p>
            <div className="input-group">
              <label htmlFor="maxNumber">최대 숫자 (3-16):</label>
              <input
                id="maxNumber"
                type="number"
                min="3"
                max="16"
                value={inputMaxNumber}
                onChange={(e) => setInputMaxNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
              />
            </div>
            <div className="modal-buttons">
              <button className="start-button" onClick={startGame}>
                게임 시작!
              </button>
            </div>
            <div className="modal-info">
              <p>💡 추천: 처음이라면 10부터 시작해보세요!</p>
            </div>
          </div>
        </div>
      )}

      <header className="game-header">
        <button className="back-button" onClick={() => window.history.back()}>
          ← 뒤로가기
        </button>
        <h1>🔢 숫자 놀이</h1>
        <button className="reset-button" onClick={resetGame}>
          설정 변경
        </button>
      </header>

      {!showModal && (
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
            {!gameStarted ? (
              <p>1번 타일을 클릭해서 게임을 시작하세요!</p>
            ) : gameCompleted ? (
              <p className="completed">🎉 축하합니다! {maxNumber}까지 모두 찾았어요!</p>
            ) : (
              <div>
                <p>찾는 숫자: <span className="current-number">{currentNumber}</span></p>
                <p>마지막 클릭: <span className="last-number">{lastClickedNumber}</span></p>
              </div>
            )}
          </div>
        </div>
      )}

      {!showModal && (
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
              <li>올바른 숫자를 클릭하면 다음 숫자가 나타납니다</li>
              <li>{maxNumber}까지 모든 숫자를 찾으면 게임 완료!</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CountingGame; 