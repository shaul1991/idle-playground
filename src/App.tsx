import './App.css';

interface Game {
  id: string;
  title: string;
  emoji: string;
  isReady: boolean;
  path?: string;
}

function App() {
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
      isReady: false,
    },
    {
      id: 'colors',
      title: '색깔 놀이',
      emoji: '🌈',
      isReady: false,
    },
  ];

  const handleGameClick = (game: Game) => {
    if (game.isReady && game.path) {
      // Navigate to game page
      console.log(`Navigating to ${game.path}`);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">🎨 idle-playground</h1>
        <p className="subtitle">아이들을 위한 인터랙티브 놀이터</p>
      </header>

      <main className="main-content">
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
      </main>
    </div>
  );
}

export default App;
