import { useNavigate, useLocation } from 'react-router-dom';
import { CuteBackground } from '../components/cute/components';
import { EmotionType, emotionColors, PrivacyBadge } from '../components/app/OurchiveComponents';
import { ArrowLeft, MapPin, Heart, Edit3, FolderPlus, Share2 } from 'lucide-react';

export default function MemoryDetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const memory = location.state?.memory;

  if (!memory) {
    return (
      <CuteBackground>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Memory not found</p>
        </div>
      </CuteBackground>
    );
  }

  return (
    <CuteBackground>
      <div className="min-h-screen pb-8">
        <div className="max-w-md mx-auto px-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Capsule</span>
          </button>
        </div>

        <div className="max-w-md mx-auto px-4 mb-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={memory.image} 
              alt={memory.location}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>

        <div className="max-w-md mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-white">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: emotionColors[memory.emotion as EmotionType] }}
                  />
                  <span className="font-semibold text-gray-900">{memory.emotion}</span>
                </div>
                <span className="text-sm text-gray-500">{memory.intensity}% intensity</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${memory.intensity}%`,
                    backgroundColor: emotionColors[memory.emotion as EmotionType]
                  }}
                />
              </div>
            </div>

            <div className="mb-5 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{memory.location}</p>
                  <p className="text-xs text-gray-500">{memory.timestamp}</p>
                </div>
              </div>

              {memory.heartRate && (
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">{memory.heartRate}</span> BPM
                  </span>
                </div>
              )}
            </div>

            <div className="mb-5">
              <PrivacyBadge type={memory.privacy} />
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-blue-400 text-white py-3 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all">
                <Edit3 className="w-4 h-4" />
                Edit Tags
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-2.5 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors">
                  <FolderPlus className="w-4 h-4" />
                  Collections
                </button>
                
                {memory.privacy === 'Public' && (
                  <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-2.5 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-4 opacity-60">
            <span className="text-2xl">✨</span>
          </div>
        </div>
      </div>
    </CuteBackground>
  );
}