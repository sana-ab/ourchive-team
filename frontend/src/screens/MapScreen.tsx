import { useState, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { CuteBackground } from '../components/cute/components';
import { 
  TopNav, 
  TabBar,
  EmotionType,
  emotionColors
} from '../components/app/OurchiveComponents';

const mockPins = [
  { id: 1, emotion: 'Excited' as EmotionType, lat: 51.0447, lng: -114.0719, location: 'UCalgary', timestamp: '2 hours ago', isPulsing: true },
  { id: 2, emotion: 'Calm' as EmotionType, lat: 51.0534, lng: -114.0625, location: 'Prince\'s Island', timestamp: '5 hours ago' },
  { id: 3, emotion: 'Aroused' as EmotionType, lat: 51.0486, lng: -114.0708, location: 'Stampede Grounds', timestamp: '1 day ago' },
];

export default function MapScreen() {
  const [selectedPin, setSelectedPin] = useState<typeof mockPins[0] | null>(mockPins[0]);
  const globeEl = useRef<any>();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.3;
    }
  }, []);

  const pointsData = mockPins.map(pin => ({
    ...pin,
    size: pin.isPulsing ? 0.8 : 0.5,
    color: emotionColors[pin.emotion],
  }));

  return (
    <CuteBackground>
      <div className="min-h-screen pb-24">
        <TopNav title="Map Archive" />

        <div className="relative h-[calc(100vh-180px)] max-w-md mx-auto">
          <div className="absolute inset-0 m-4 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-pink-50 opacity-30" />
            
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              
              pointsData={pointsData}
              pointAltitude={0.01}
              pointRadius="size"
              pointColor="color"
              pointLabel={(d: any) => `
                <div style="
                  background: white;
                  padding: 8px 12px;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  font-family: sans-serif;
                  font-size: 13px;
                ">
                  <div style="font-weight: 600;">${d.emotion}</div>
                  <div style="font-size: 11px; color: #666;">${d.location}</div>
                </div>
              `}
              onPointClick={(point: any) => setSelectedPin(point)}
              
              atmosphereColor="rgba(173, 216, 230, 0.6)"
              atmosphereAltitude={0.15}
              
              width={Math.min(window.innerWidth - 32, 416)}
              height={window.innerHeight - 180}
              
              enablePointerInteraction={true}
            />
          </div>

          {selectedPin && (
            <div className="absolute bottom-0 left-0 right-0 p-4 animate-slide-up">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ 
                          backgroundColor: `${emotionColors[selectedPin.emotion]}20`,
                          color: emotionColors[selectedPin.emotion]
                        }}
                      >
                        {selectedPin.emotion}
                      </span>
                      <span className="text-xs text-gray-500">{selectedPin.timestamp}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedPin.location}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedPin(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <span>✕</span>
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