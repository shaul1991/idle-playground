import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { ColorType, ShapeType, ColorShapeQuestion, ColorShapeOption, ColorShapeGameState, ColorShapeDifficulty } from '../types';
import '../styles/ColorShapeGame.scss';

const ColorShapeGame: React.FC = () => {
  const [gameState, setGameState] = useState<ColorShapeGameState>({
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    correctAnswers: 0,
    isCompleted: false,
    startTime: null,
    endTime: null,
    difficulty: null
  });

  const [currentQuestion, setCurrentQuestion] = useState<ColorShapeQuestion | null>(null);
  const [showStartModal, setShowStartModal] = useState(true);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCorrectAlert, setShowCorrectAlert] = useState(false);

  // 색깔과 도형 정의
  const colors: ColorType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
  const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];

  // 색깔 코드 매핑
  const colorCodes = {
    red: '#FF6B6B',
    blue: '#4ECDC4',
    green: '#45B7D1',
    yellow: '#FFA726',
    purple: '#AB47BC',
    orange: '#FF8A65',
    pink: '#F06292',
    cyan: '#26C6DA'
  };

  // 중성 색상 (도형 문제용)
  const neutralColor = '#6B7280';

  // 도형 이모지 매핑
  const shapeEmojis = {
    circle: '●',
    square: '■',
    triangle: '▲',
    star: '★',
    heart: '♥',
    diamond: '◆'
  };

  // 문제 생성 함수
  const generateQuestion = useCallback((): ColorShapeQuestion => {
    const questionType = Math.random() < 0.5 ? 'color' : 'shape';
    const target = questionType === 'color' 
      ? colors[Math.floor(Math.random() * colors.length)]
      : shapes[Math.floor(Math.random() * shapes.length)];

    // 정답 옵션 생성
    const correctOption: ColorShapeOption = {
      id: 'correct',
      color: gameState.difficulty === 'easy' && questionType === 'shape' 
        ? 'red' as ColorType // 쉬움 난이도 도형 문제는 중성 색상 사용
        : questionType === 'color' 
          ? target as ColorType 
          : colors[Math.floor(Math.random() * colors.length)],
      shape: gameState.difficulty === 'easy' && questionType === 'color'
        ? 'circle' as ShapeType // 쉬움 난이도 색상 문제는 동일한 도형 사용
        : questionType === 'shape' 
          ? target as ShapeType 
          : shapes[Math.floor(Math.random() * shapes.length)],
      isCorrect: true
    };

    // 오답 옵션 3개 생성 (난이도에 따라 다르게)
    const wrongOptions: ColorShapeOption[] = [];
    for (let i = 0; i < 3; i++) {
      let wrongOption: ColorShapeOption;
      do {
        if (gameState.difficulty === 'easy') {
          // 쉬움 난이도: 찾는 조건과 반대는 고정, 찾는 조건만 다르게
          wrongOption = {
            id: `wrong-${i}`,
            color: questionType === 'color' 
              ? colors[Math.floor(Math.random() * colors.length)]
              : 'red' as ColorType, // 도형 문제일 때는 모든 옵션이 중성 색상
            shape: questionType === 'shape' 
              ? shapes[Math.floor(Math.random() * shapes.length)]
              : 'circle' as ShapeType, // 색상 문제일 때는 모든 옵션이 동일한 도형
            isCorrect: false
          };
        } else {
          // 어려움 난이도: 색상과 도형을 자유롭게 섞기
          wrongOption = {
            id: `wrong-${i}`,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            isCorrect: false
          };
        }
      } while (
        (questionType === 'color' && wrongOption.color === target) ||
        (questionType === 'shape' && wrongOption.shape === target) ||
        wrongOptions.some(opt => opt.color === wrongOption.color && opt.shape === wrongOption.shape) ||
        (wrongOption.color === correctOption.color && wrongOption.shape === correctOption.shape)
      );
      wrongOptions.push(wrongOption);
    }

    // 옵션들을 랜덤하게 섞기
    const allOptions = [correctOption, ...wrongOptions];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.findIndex(opt => opt.isCorrect);

    return {
      id: `question-${gameState.currentQuestion + 1}`,
      type: questionType,
      target,
      options: shuffledOptions,
      correctOptionIndex: correctIndex
    };
  }, [gameState.currentQuestion, gameState.difficulty, colors, shapes]);

  // 난이도 선택 시작
  const showDifficultySelection = useCallback(() => {
    setShowStartModal(false);
    setShowDifficultyModal(true);
  }, []);

  // 게임 시작
  const startGame = useCallback((difficulty: ColorShapeDifficulty) => {
    setGameState(prev => ({
      ...prev,
      startTime: Date.now(),
      currentQuestion: 0,
      score: 0,
      correctAnswers: 0,
      isCompleted: false,
      difficulty
    }));
    setShowDifficultyModal(false);
    setCurrentQuestion(generateQuestion());
  }, [generateQuestion]);

  // 답안 선택 처리
  const handleOptionClick = useCallback((optionIndex: number) => {
    if (!currentQuestion || showCorrectAlert) return;

    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
    
    if (isCorrect) {
      // 정답인 경우: 게임 상태 업데이트하고 "정답입니다" 알림 표시
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10, // 정답 시 10점 추가
        correctAnswers: prev.correctAnswers + 1,
        currentQuestion: prev.currentQuestion + 1
      }));

      // "정답입니다" 알림 표시
      setShowCorrectAlert(true);
      
      setTimeout(() => {
        setShowCorrectAlert(false);
        
        if (gameState.currentQuestion + 1 >= gameState.totalQuestions) {
          // 게임 완료
          setGameState(prev => ({
            ...prev,
            isCompleted: true,
            endTime: Date.now()
          }));
          setShowCompletionModal(true);
        } else {
          // 다음 문제
          setCurrentQuestion(generateQuestion());
        }
      }, 1500);
    }
    // 오답인 경우: 아무런 반응도 하지 않음 (현재 문제에 머물러 있음)
  }, [currentQuestion, gameState.currentQuestion, gameState.totalQuestions, generateQuestion, showCorrectAlert]);

  // 게임 재시작
  const restartGame = useCallback(() => {
    setGameState({
      currentQuestion: 0,
      totalQuestions: 10,
      score: 0,
      correctAnswers: 0,
      isCompleted: false,
      startTime: null,
      endTime: null,
      difficulty: null
    });
    setShowStartModal(true);
    setShowDifficultyModal(false);
    setShowCompletionModal(false);
    setCurrentQuestion(null);
  }, []);

  // 홈으로 이동
  const goToHome = useCallback(() => {
    window.history.back();
  }, []);

  // 시간 계산
  const getElapsedTime = useCallback((): number => {
    if (!gameState.startTime) return 0;
    const endTime = gameState.endTime || Date.now();
    return endTime - gameState.startTime;
  }, [gameState.startTime, gameState.endTime]);

  // 시간 포맷팅
  const formatTime = useCallback((milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${remainingSeconds}초`;
    }
  }, []);

  return (
    <Layout 
      title="🌈 색깔/모형 놀이"
      headerActions={
        <button 
          className="settings-button"
          onClick={restartGame}
          aria-label="게임 재시작"
        >
          🔄
        </button>
      }
    >
      <div className="color-shape-game">
        {/* 시작 모달 */}
        {showStartModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>🌈 색깔/모형 놀이</h2>
              <p>제시된 색깔이나 도형을 찾아보세요!</p>
              <div className="game-rules">
                <h3>게임 방법</h3>
                <ul>
                  <li>위쪽에 나타나는 색깔이나 도형을 확인하세요</li>
                  <li>아래 4개의 타일 중에서 맞는 것을 선택하세요</li>
                  <li>총 10문제를 풀어보세요</li>
                  <li>오답을 선택해도 다음 문제로 넘어갑니다</li>
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
            <div className="modal-content">
              <h2>난이도 선택</h2>
              <p>원하는 난이도를 선택해주세요!</p>
              <div className="difficulty-buttons">
                <button 
                  className="difficulty-button easy"
                  onClick={() => startGame('easy')}
                >
                  <div className="difficulty-label">🌱 쉬움</div>
                  <div className="difficulty-description">색깔만 또는 도형만 나타남</div>
                </button>
                <button 
                  className="difficulty-button hard"
                  onClick={() => startGame('hard')}
                >
                  <div className="difficulty-label">🔥 어려움</div>
                  <div className="difficulty-description">색깔과 도형이 함께 나타남</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 완료 모달 */}
        {showCompletionModal && (
          <div className="modal-overlay">
            <div className="modal-content completion-modal">
              <h2>🎉 완료!</h2>
              <div className="completion-stats">
                <p className="score">점수: {gameState.score}점</p>
                <p className="correct">정답: {gameState.correctAnswers}/{gameState.totalQuestions}</p>
                <p className="time">시간: {formatTime(getElapsedTime())}</p>
                <p className="accuracy">정확도: {Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)}%</p>
              </div>
              <div className="completion-buttons">
                <button className="play-again-button" onClick={restartGame}>
                  🔄 다시하기
                </button>
                <button className="home-button" onClick={goToHome}>
                  🏠 홈으로
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 정답 알림 */}
        {showCorrectAlert && (
          <div className="correct-alert-overlay">
            <div className="correct-alert">
              <div className="correct-icon">🎉</div>
              <p className="correct-text">정답입니다!</p>
            </div>
          </div>
        )}

        {/* 게임 영역 */}
        {!showStartModal && !showCompletionModal && currentQuestion && (
          <div className="game-area">
            {/* 진행상황 */}
            <div className="progress-area">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(gameState.currentQuestion / gameState.totalQuestions) * 100}%` }}
                />
              </div>
              <p className="progress-text">
                {gameState.currentQuestion + 1} / {gameState.totalQuestions}
              </p>
            </div>

            {/* 문제 영역 */}
            <div className="question-area">
              <h3>이것을 찾아보세요!</h3>
              <div className="target-display">
                {currentQuestion.type === 'color' ? (
                  <div className="target-item">
                    <div 
                      className="color-sample"
                      style={{ backgroundColor: colorCodes[currentQuestion.target as ColorType] }}
                    />
                    <p className="target-label">이 색깔</p>
                  </div>
                ) : (
                  <div className="target-item">
                    <div 
                      className="shape-sample"
                      style={{ 
                        color: 'white'
                      }}
                    >
                      {shapeEmojis[currentQuestion.target as ShapeType]}
                    </div>
                    <p className="target-label">이 도형</p>
                  </div>
                )}
              </div>
            </div>

            {/* 선택 영역 */}
            <div className="options-area">
              <div className="options-grid">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.id}
                    className={`option-tile ${showCorrectAlert ? 'disabled' : ''} ${
                      gameState.difficulty === 'easy' && currentQuestion.type === 'color' ? 'color-only' : ''
                    }`}
                    onClick={() => handleOptionClick(index)}
                    disabled={showCorrectAlert}
                  >
                    <div 
                      className="option-background"
                      style={{ 
                        backgroundColor: gameState.difficulty === 'easy' && currentQuestion.type === 'shape' 
                          ? neutralColor 
                          : colorCodes[option.color]
                      }}
                    />
                    {!(gameState.difficulty === 'easy' && currentQuestion.type === 'color') && (
                      <div 
                        className="option-shape"
                        style={{ color: 'white' }}
                      >
                        {shapeEmojis[option.shape]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ColorShapeGame; 