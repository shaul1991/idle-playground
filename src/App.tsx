import './styles/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CountingGame from './pages/CountingGame';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/counting" element={<CountingGame />} />
      </Routes>
    </Router>
  );
}

export default App;
