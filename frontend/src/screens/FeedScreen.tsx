import { useState, useEffect } from 'react';
import { CuteBackground } from '../components/cute/components';
import { TopNav, TabBar, MemoryCard, NotificationOverlay, EmotionType } from '../components/app/OurchiveComponents';


interface Memory {
  id: number;
  emotion: EmotionType;
  intensity: number;
  timestamp: string;
  location: string;
  latitude: number;
  longitude: number;
  heartRate: number;
  privacy: 'Private' | 'Friends' | 'Public';
  image: string;
}

export default function FeedScreen() {
  const [showNotification, setShowNotification] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    // Load from localStorage
    const savedMemories = JSON.parse(localStorage.getItem('memories') || '[]');
    setMemories(savedMemories);
  }, []);

  return (
    <CuteBackground>
      <div className="min-h-screen pb-24">
        <TopNav 
          title="Ourchive"
          showNotifications
          showProfile
          onNotificationClick={() => setShowNotification(true)}
        />
        
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {memories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No memories yet. Capture your first moment! 📸</p>
            </div>
          ) : (
            memories.map((memory) => (
              <MemoryCard key={memory.id} {...memory} />
            ))
          )}
        </div>
      </div>
      
      <TabBar />
      
      {showNotification && (
        <NotificationOverlay onClose={() => setShowNotification(false)} />
      )}
    </CuteBackground>
  );
}