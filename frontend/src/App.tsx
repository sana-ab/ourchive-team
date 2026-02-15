import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeModel } from './services/MLEmotionDetection';
import AuthScreen from './screens/AuthScreen';
import FeedScreen from './screens/FeedScreen';
import MapScreen from './screens/MapScreen';
import CaptureScreen from './screens/CaptureScreen';
import ProfileScreen from './screens/ProfileScreen';
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
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/feed" element={<FeedScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/capture" element={<CaptureScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;