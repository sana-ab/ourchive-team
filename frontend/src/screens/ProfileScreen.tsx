import { ChevronRight } from 'lucide-react';
import { CuteBackground } from '../components/cute/components';
import { TopNav, TabBar } from '../components/app/OurchiveComponents';

export default function ProfileScreen() {
  const statCards = [
    { label: 'Memories', value: '24' },
    { label: 'Public', value: '12' },
    { label: 'Top Emotion', value: 'Calm' },
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
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-blue-300 mx-auto mb-4 flex items-center justify-center text-4xl">
              👤
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Hackathon Team</h2>
            <p className="text-sm text-gray-500">Member since Feb 2026</p>
          </div>

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
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50"
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

          <button className="w-full py-3 text-red-500 hover:text-red-600 font-semibold text-sm">
            Sign Out
          </button>
        </div>
      </div>
      
      <TabBar />
    </CuteBackground>
  );
}