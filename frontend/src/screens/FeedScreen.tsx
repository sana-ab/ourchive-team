import { useState, useEffect } from 'react';
import { getAllMemories, Memory } from '../services/api';
import { CuteBackground } from '../components/cute/components';
import { TopNav, TabBar, MemoryCard, NotificationOverlay } from '../components/app/OurchiveComponents';

export default function FeedScreen() {
  const [showNotification, setShowNotification] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Year');

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

  // Filter memories by time
  const filteredMemories = memories.filter(m => {
    const memoryDate = new Date(m.createdAt || m.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - memoryDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    if (timeFilter === 'Today') return diffDays < 1;
    if (timeFilter === 'Week') return diffDays < 7;
    if (timeFilter === 'Month') return diffDays < 30;
    if (timeFilter === 'Year') return diffDays < 365;
    
    return true;
  });

  return (
    <CuteBackground>
      <div className="min-h-screen pb-24">
        <TopNav 
          title="Ourchive"
          showNotifications
          showProfile
          onNotificationClick={() => setShowNotification(true)}
        />
        
        {/* Time Filter Tabs */}
        <div className="max-w-md mx-auto px-4 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['Today', 'Week', 'Month', 'Year'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  timeFilter === filter 
                    ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-4 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mb-3"></div>
              <p className="text-gray-500">Loading memories...</p>
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {timeFilter === 'Year' ? 'No memories yet' : `No memories from ${timeFilter.toLowerCase()}`}
              </h3>
              <p className="text-gray-500">
                {timeFilter === 'Year' 
                  ? 'Capture your first moment!' 
                  : 'Try selecting a different time period'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
              </p>
              {filteredMemories.map((memory) => (
                <MemoryCard 
                  key={memory.id}
                  id={memory.id}
                  image={memory.imageUrl ? `http://localhost:3001${memory.imageUrl}` : undefined}
                  emotion={memory.emotion as any}
                  intensity={memory.intensity}
                  timestamp={memory.timestamp}
                  location={memory.location}
                  heartRate={memory.heartRate}
                  privacy={memory.privacy}
                />
              ))}
            </>
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