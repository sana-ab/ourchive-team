import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './screens/AuthScreen';
import FeedScreen from './screens/FeedScreen';
import MapScreen from './screens/MapScreen';
import CaptureScreen from './screens/CaptureScreen';
import ProfileScreen from './screens/ProfileScreen';
import MemoryDetailScreen from './screens/MemoryDetailScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/feed" element={<FeedScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/capture" element={<CaptureScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        
        {/* Corrected Line: No colons, no trailing comma, properly closed tag */}
        <Route path="/memory/:id" element={<MemoryDetailScreen />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}