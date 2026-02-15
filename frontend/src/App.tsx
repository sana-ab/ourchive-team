import { useEffect } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { router } from './routes';
import { initializeModel } from './services/MLEmotionDetection';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize ML model when app loads
    initializeModel().catch(err => {
      console.error('Failed to initialize ML model:', err);
    });
  }, []);

  return (
    <Router>
      <Routes/>
    </Router>
  );
}

export default App;