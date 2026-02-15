import React, { useEffect, useState } from 'react';
import { Heart, X, Camera, Activity } from 'lucide-react';
import { emotionColors, EmotionType } from './app/OurchiveComponents';

interface BiometricNotificationProps {
  emotion: EmotionType | string;
  heartRate: number;
  intensity: number;
  onCapture: () => void;
  onDismiss: () => void;
}

export default function BiometricNotification({
  emotion,
  heartRate,
  intensity,
  onCapture,
  onDismiss
}: BiometricNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setIsVisible(true);
    
    // Auto-dismiss after 8 seconds if no action taken
    const timer = setTimeout(() => {
      handleDismiss();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for exit animation
  };

  // Get color based on emotion
  const color = emotionColors[emotion as EmotionType] || emotionColors['Calm'];

  return (
    <div 
      className={`
        fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md
        transform transition-all duration-500 ease-out z-50
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
    >
      <div className="bg-gray-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        
        {/* Glowing background effect */}
        <div 
          className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: color }}
        />

        <div className="flex items-start gap-4 relative z-10">
          {/* Icon Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20"
              style={{ backgroundColor: `${color}30` }} // 30% opacity hex
            >
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg leading-tight mb-1">
              Emotional Moment Detected
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              We detected a spike in intensity ({intensity}%) and heart rate. Do you want to capture this <strong>{emotion}</strong> moment?
            </p>

            <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mb-3">
              <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md">
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                {heartRate} BPM
              </span>
              <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {emotion}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onCapture}
                className="flex-1 bg-white text-black py-2 px-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Capture Memory
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:bg-white/10 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Close X */}
          <button 
            onClick={handleDismiss}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}