import './App.css';

function App() {
  const env = process.env.REACT_APP_ENV;
  const version = process.env.REACT_APP_VERSION;
  const debugMode = process.env.REACT_APP_DEBUG === 'true';

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎨 idle-playground</h1>
        <p>아이들을 위한 인터랙티브 놀이터</p>
        <p>프로젝트 초기 설정이 완료되었습니다!</p>
        
        {debugMode && (
          <div style={{ marginTop: '20px', fontSize: '14px', opacity: 0.7 }}>
            <p>환경: {env}</p>
            <p>버전: {version}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
