import { ChevronRight } from 'lucide-react';
import { CuteBackground } from '../components/cute/components';
import { TopNav, TabBar, emotionColors, EmotionType } from '../components/app/OurchiveComponents';
import { useState, useEffect } from 'react';
import { getStats } from '../services/api';

export default function ProfileScreen() {
  const [stats, setStats] = useState({
    totalMemories: 0,
    publicMemories: 0,
    privateMemories: 0,
    friendsMemories: 0,
    topEmotion: 'Calm' as EmotionType,
    avgHeartRate: 0,
    avgIntensity: 0,
    emotionBreakdown: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const data = await getStats();
    if (data) {
      // Find top emotion
      const emotions = data.emotionBreakdown || {};
      const topEmotion = Object.keys(emotions).reduce((a, b) => 
        emotions[a] > emotions[b] ? a : b, 'Calm'
      ) as EmotionType;
      
      setStats({
        totalMemories: data.totalMemories || 0,
        publicMemories: data.publicMemories || 0,
        privateMemories: data.privateMemories || 0,
        friendsMemories: data.friendsMemories || 0,
        topEmotion,
        avgHeartRate: data.avgHeartRate || 0,
        avgIntensity: data.avgIntensity || 0,
        emotionBreakdown: data.emotionBreakdown || {}
      });
    }
    setLoading(false);
  }

  const statCards = [
    { label: 'Memories', value: stats.totalMemories.toString() },
    { label: 'Public', value: stats.publicMemories.toString() },
    { label: 'Top Emotion', value: stats.topEmotion },
  ];

  const settingsItems = [
    { label: 'Notifications', icon: '🔔' },
    { label: 'Wearables', icon: '⌚' },
    { label: 'Privacy', icon: '🔒' },
    { label: 'Export', icon: '📦' },
  ];

  return (
    <CuteBackground>
      <div className="min-h-screen pb-24">
        <TopNav title="Profile" />

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-blue-300 mx-auto mb-4 flex items-center justify-center text-4xl">
              👤
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Hackathon Team</h2>
            <p className="text-sm text-gray-500">Member since Feb 2026</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-pink-100 to-blue-100 px-3 py-1.5 border-b">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                  </div>
                </div>
                <div className="p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-[11px] text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Emotion Breakdown Chart - NEW! */}
          {!loading && stats.totalMemories > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span>
                Emotion Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.emotionBreakdown).map(([emotion, count]) => {
                  const percentage = (count / stats.totalMemories) * 100;
                  return (
                    <div key={emotion}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: emotionColors[emotion as EmotionType] }}
                          />
                          <span className="font-medium text-gray-700">{emotion}</span>
                        </div>
                        <span className="text-gray-500">{count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: emotionColors[emotion as EmotionType]
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Health Stats - NEW! */}
          {!loading && stats.totalMemories > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>❤️</span>
                Health Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <div className="text-3xl font-bold text-red-500">{stats.avgHeartRate}</div>
                  <div className="text-xs text-gray-600 mt-1">Avg Heart Rate</div>
                  <div className="text-xs text-gray-500">BPM</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-500">{stats.avgIntensity}%</div>
                  <div className="text-xs text-gray-600 mt-1">Avg Intensity</div>
                  <div className="text-xs text-gray-500">Emotional</div>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-100 to-blue-100 px-5 py-3 flex items-center justify-between border-b">
              <h2 className="font-semibold text-sm text-gray-800">Settings</h2>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-blue-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-purple-300" />
              </div>
            </div>

            <div className="divide-y">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-3 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors">
            Sign Out
          </button>
        </div>
      </div>
      
      <TabBar />
    </CuteBackground>
  );
}