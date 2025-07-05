import './styles/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import CountingGame from './pages/CountingGame';
import ColorShapeGame from './pages/ColorShapeGame';
import HomePage from './pages/HomePage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/counting" element={<CountingGame />} />
          <Route path="/colors" element={<ColorShapeGame />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
