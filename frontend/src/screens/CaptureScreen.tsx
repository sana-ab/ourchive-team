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

            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-cen