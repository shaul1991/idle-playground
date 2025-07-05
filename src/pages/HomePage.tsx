import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsModal from '../components/SettingsModal';
import Layout from '../components/Layout';
import '../styles/HomePage.scss';

interface Game {
  id: string;
  title: string;
  emoji: string;
  isReady: boolean;
  path?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Environment variables from HEAD branch
  const env = process.env.REACT_APP_ENV;
  const version = process.env.REACT_APP_VERSION;
  const debugMode = process.env.REACT_APP_DEBUG === 'true';

  // 모달 스크롤 방지
  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSettingsOpen]);

  // Games array from origin/main branch
  const games: Game[] = [
    {
      id: 'drawing',
      title: '그림 그리기',
      emoji: '🎨',
      isReady: false,
    },
    {
      id: 'puzzle',
      title: '퍼즐 맞추기',
      emoji: '🧩',
      isReady: false,
    },
    {
      id: 'memory',
      title: '기억력 게임',
      emoji: '🧠',
      isReady: false,
    },
    {
      id: 'music',
      title: '음악 놀이',
      emoji: '🎵',
      isReady: false,
    },
    {
      id: 'counting',
      title: '숫자 놀이',
      emoji: '🔢',
      isReady: true,
      path: '/counting',
    },
    {
      id: 'colors',
      title: '색깔 놀이',
      emoji: '🌈',
      isReady: true,
      path: '/colors',
    },
  ];

  const handleGameClick = (game: Game) => {
    if (game.isReady && game.path) {
      navigate(game.path);
    }
  };

  return (
    <Layout 
      title="🎨 idle-playground" 
      showHomeButton={false}
      showAdBanner={false}
      headerActions={
        <button 
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="설정"
        >
          ⚙️
        </button>
      }
    >
      <div className="home-page">
        <div className="home-header">
          <p className="subtitle">아이들을 위한 인터랙티브 놀이터</p>
          
          {debugMode && (
            <div style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
              <p>환경: {env}</p>
              <p>버전: {version}</p>
            </div>
          )}
        </div>

        <div className="games-grid">
          {games.map(game => (
            <div
              key={game.id}
              className={`game-tile ${game.isReady ? 'ready' : 'coming-soon'}`}
              onClick={() => handleGameClick(game)}
            >
              <div className="game-emoji">{game.emoji}</div>
              <div className="game-title">{game.title}</div>
              {!game.isReady && (
                <div className="coming-soon-label">Coming Soon</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </Layout>
  );
};

export default HomePage; 