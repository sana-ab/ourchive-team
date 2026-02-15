import { CuteBackground } from '../components/cute/components';
import { TopNav, TabBar, MemoryCard, EmotionType, NotificationOverlay } from '../components/app/OurchiveComponents';
import { useState } from 'react';

const mockMemories = [
  {
    id: 1,
    emotion: 'Excited' as EmotionType,
    intensity: 87,
    timestamp: '2 hours ago',
    location: 'University of Calgary - Campus Quad',
    heartRate: 105,
    privacy: 'Public' as const,
  },
  {
    id: 2,
    emotion: 'Calm' as EmotionType,
    intensity: 72,
    timestamp: '5 hours ago',
    location: 'Prince\'s Island Park',
    heartRate: 68,
    privacy: 'Private' as const,
  },
  {
    id: 3,
    emotion: 'Aroused' as EmotionType,
    intensity: 91,
    timestamp: '1 day ago',
    location: 'Calgary Stampede Grounds',
    heartRate: 98,
    privacy: 'Public' as const,
  },
];

export default function FeedScreen() {
  const [showNotification, setShowNotification] = useState(false);

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
          {mockMemories.map((memory) => (
            <MemoryCard key={memory.id} {...memory} />
          ))}
        </div>
      </div>
      
      <TabBar />
      
      {showNotification && (
        <NotificationOverlay onClose={() => setShowNotification(false)} />
      )}
    </CuteBackground>
  );
}