import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, RotateCw } from 'lucide-react';
import { emotionColors, EmotionType } from '../components/app/OurchiveComponents';

export default function CaptureScreen() {
  const [emotion] = useState<EmotionType>('Excited');
  const [privacy, setPrivacy] = useState<'Private' | 'Friends' | 'Public'>('Private');
  const navigate = useNavigate();

  const privacyOptions: ('Private' | 'Friends' | 'Public')[] = ['Private', 'Friends', 'Public'];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="w-full h-full relative">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${emotionColors[emotion]} 100%)`
        }}
      />

      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-white">
            <button 
              onClick={() => navigate('/feed')}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: emotionColors[emotion] }}
                />
                <span className="text-sm font-medium">{emotion}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <Heart className="w-4 h-4 fill-current text-red-400" />
                <span className="text-sm font-medium">105 BPM</span>
              </div>

              <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <span className="text-sm font-medium">2:47 PM</span>
              </div>
            </div>

            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <RotateCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{ 
              backgroundColor: emotionColors[emotion],
              opacity: 0.3,
              transform: 'scale(1.8)'
            }}
          />
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{ 
              backgroundColor: emotionColors[emotion],
              opacity: 0.2,
              transform: 'scale(2.2)',
              animationDelay: '0.5s'
            }}
          />
          
          <button 
            onClick={() => navigate('/feed')}
            className="relative w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <div 
              className="w-16 h-16 rounded-full"
              style={{ 
                background: `linear-gradient(135deg, ${emotionColors[emotion]}, ${emotionColors[emotion]}dd)`
              }}
            />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-1">
              {privacyOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setPrivacy(option)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    privacy === option
                      ? 'bg-white text-gray-800 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-white/80">
            Add to your archive
          </p>
        </div>
      </div>
    </div>
  );
}