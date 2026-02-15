import { useState, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { CuteBackground } from '../components/cute/components';
import { TopNav, TabBar, EmotionType, emotionColors } from '../components/app/OurchiveComponents';
import { getAllMemories } from '../services/api';

export default function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [pins, setPins] = useState<any[]>([]);
  const globeEl = useRef<any>(null);
  const mockPins = [
  { id: 1, emotion: 'Excited' as EmotionType, lat: 51.0447, lng: -114.0719, location: 'UCalgary', timestamp: '2 hours ago', isPulsing: true },
  { id: 2, emotion: 'Calm' as EmotionType, lat: 51.0534, lng: -114.0625, location: 'Prince\'s Island', timestamp: '5 hours ago' },
  { id: 3, emotion: 'Aroused' as EmotionType, lat: 51.0486, lng: -114.0708, location: 'Stampede Grounds', timestamp: '1 day ago' },
];

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
    }
  }, []);

  useEffect(() => {
    // Load memories from backend
    loadMemories();
  }, []);

  const loadMemories = async () => {
    const memories = await getAllMemories();
    const memoryPins = memories.map(memory => ({
      id: memory.id,
      emotion: memory.emotion as EmotionType,
      lat: memory.latitude || 51.0447,
      lng: memory.longitude || -114.0719,
      location: memory.location,
      timestamp: memory.timestamp,
      isPulsing: true,
    }));
    setPins(memoryPins);
  };

  const pointsData = pins.map(pin => ({
    ...pin,
    size: pin.isPulsing ? 0.8 : 0.5,
    color: emotionColors[pin.emotion as EmotionType],
  }));

  return (
    <CuteBackground>
      <div className="min-h-screen pb-24">
        <TopNav title="Map Archive" />

        <div className="relative h-[calc(100vh-180px)] max-w-md mx-auto">
          <div className="absolute inset-0 m-4 rounded-3xl overflow-hidden shadow-2xl">
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              
              pointsData={pointsData}
              pointAltitude={0.01}
              pointRadius="size"
              pointColor="color"
              onPointClick={(point: any) => setSelectedPin(point)}
              
              atmosphereColor="rgba(173, 216, 230, 0.6)"
              atmosphereAltitude={0.15}
              
              width={Math.min(window.innerWidth - 32, 416)}
              height={window.innerHeight - 180}
            />
          </div>

          {selectedPin && (
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ 
                      backgroundColor: `${emotionColors[selectedPin.emotion as EmotionType]}20`,
                      color: emotionColors[selectedPin.emotion as EmotionType]
                    }}>
                      {selectedPin.emotion}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{selectedPin.location}</h3>
                    <p className="text-xs text-gray-500">{selectedPin.timestamp}</p>
                  </div>
                  <button onClick={() => setSelectedPin(null)} className="w-8 h-8 rounded-full bg-gray-100">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <TabBar />
    </CuteBackground>
  );
}