import { Heart, MapPin, Lock, Users, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Emotion colors
export const emotionColors = {
  Calm: '#5DD4C8',
  Excited: '#A8E6CF',
  Stressed: '#FFB88C',
  Aroused: '#FF9AA2',
};

export type EmotionType = keyof typeof emotionColors;

// Privacy Badge
export function PrivacyBadge({ type }: { type: 'Private' | 'Friends' | 'Public' }) {
  const icons = {
    Private: <Lock className="w-3 h-3" />,
    Friends: <Users className="w-3 h-3" />,
    Public: <Globe className="w-3 h-3" />,
  };
  
  const colors = {
    Private: 'bg-gray-100 text-gray-600',
    Friends: 'bg-blue-100 text-blue-600',
    Public: 'bg-green-100 text-green-600',
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${colors[type]}`}>
      {icons[type]}
      <span>{type}</span>
    </div>
  );
}

// Emotion Indicator
export function EmotionIndicator({ 
  emotion, 
  intensity 
}: { 
  emotion: EmotionType; 
  intensity?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-2.5 h-2.5 rounded-full" 
        style={{ backgroundColor: emotionColors[emotion] }}
      />
      <span className="text-[13px] font-medium text-gray-700">{emotion}</span>
      {intensity !== undefined && (
        <>
          <div className="flex-1 max-w-[80px]">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${intensity}%`,
                  backgroundColor: emotionColors[emotion]
                }}
              />
            </div>
          </div>
          <span className="text-[11px] text-gray-500">{intensity}%</span>
        </>
      )}
    </div>
  );
}

// Memory Card
export function MemoryCard({
  id,
  image,
  emotion,
  intensity,
  timestamp,
  location,
  heartRate,
  privacy,
  onClick,
}: {
  id?: number;
  image?: string;
  emotion: EmotionType;
  intensity?: number;
  timestamp: string;
  location: string;
  heartRate?: number;
  privacy: 'Private' | 'Friends' | 'Public';
  onClick?: () => void;
}) {

  const navigate = useNavigate();
  
  // Create memory object for navigation
  const memoryData = {
    id,
    image,
    emotion,
    intensity,
    timestamp,
    location,
    heartRate,
    privacy
  };
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => {
        if (onClick) {
          onClick();
        } else if (id) {
          navigate(`/memory/${id}`, { state: { memory: memoryData } });
        }
      }}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {image ? (
          <img src={image} alt="Memory" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <MapPin className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <PrivacyBadge type={privacy} />
        </div>
      </div>

      <div className="p-4 space-y-2">
        <EmotionIndicator emotion={emotion} intensity={intensity} />
        
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-gray-500">{timestamp}</span>
          {heartRate && (
            <div className="flex items-center gap-1 text-[12px] text-red-500">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{heartRate} BPM</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tab Bar
export function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { name: 'Feed', path: '/feed', icon: '📱' },
    { name: 'Map', path: '/map', icon: '🗺️' },
    { name: 'Capture', path: '/capture', icon: '📸', isCenter: true },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200">
      <div className="flex items-end justify-around px-4 py-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          if (tab.isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative -mt-6"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-pink-300 to-pink-400 shadow-xl flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-transform">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
                  <span className="relative">{tab.icon}</span>
                </div>
              </button>
            );
          }
          
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
                isActive ? 'text-pink-500' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Top Nav Header
export function TopNav({ 
  title, 
  showNotifications = false,
  showProfile = false,
  rightContent,
  onNotificationClick,
}: { 
  title?: string;
  showNotifications?: boolean;
  showProfile?: boolean;
  rightContent?: React.ReactNode;
  onNotificationClick?: () => void;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            O
          </div>
          {title && (
            <h1 className="font-pixel text-sm text-gray-800">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {rightContent}
          {showNotifications && (
            <button 
              onClick={onNotificationClick}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="text-lg">🔔</span>
            </button>
          )}
          {showProfile && (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-300 to-blue-300" />
          )}
        </div>
      </div>
    </div>
  );
}

// Notification Overlay Component
export function NotificationOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full animate-slide-up">
        <div className="bg-gradient-to-r from-pink-100 to-blue-100 px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center animate-pulse">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <h3 className="font-pixel text-xs text-gray-800">Alert</h3>
          </div>
        </div>

        <div className="p-6 text-center space-y-4">
          <h2 className="font-pixel text-sm text-gray-800 leading-relaxed">
            Emotional Moment Detected
          </h2>
          
          <p className="text-[14px] text-gray-600">
            Your heart rate increased to <span className="font-semibold">105 BPM</span>
          </p>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-end justify-center gap-1 h-20">
              {[60, 65, 70, 80, 95, 105, 100].map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-red-400 to-pink-400 rounded-t transition-all"
                  style={{ height: `${(value / 105) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current animate-pulse" />
            <span className="text-4xl font-bold text-gray-800">105</span>
            <span className="text-sm text-gray-500 self-end pb-1">BPM</span>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-mint-50 rounded-xl p-3">
            <div className="flex items-center justify-center gap-2 text-[13px]">
              <span className="text-gray-600">Feeling</span>
              <span className="font-semibold text-green-600">excited</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">87% confident</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-b from-pink-300 to-pink-400 text-white rounded-full font-semibold text-[15px] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
              <span className="relative">Capture this moment</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-2.5 text-gray-600 hover:text-gray-800 text-[14px] font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}