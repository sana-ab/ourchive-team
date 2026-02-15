import { useState, useEffect } from 'react';
import { getAllMemories, Memory } from '../services/api';
import { CuteBackground } from '../components/cute/components';
import { TopNav, TabBar, MemoryCard, NotificationOverlay } from '../components/app/OurchiveComponents';

export default function FeedScreen() {
  const [showNotification, setShowNotification] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    console.log('Loading memories from backend...');
    const data = await getAllMemories();
    console.log('Got memories:', data);
    setMemories(data);
    setLoading(false);
  };

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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading memories...</p>
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No memories yet. Capture your first moment! 📸</p>
            </div>
          ) : (
            memories.map((memory) => (
              <MemoryCard 
                key={memory.id} 
                image={`http://localhost:3001${memory.imageUrl}`}
                emotion={memory.emotion as any}
                intensity={memory.intensity}
                timestamp={memory.timestamp}
                location={memory.location}
                heartRate={memory.heartRate}
                privacy={memory.privacy}
              />
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