import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, RotateCw, Camera } from 'lucide-react';
import { emotionColors, EmotionType } from '../components/app/OurchiveComponents';
import { createMemory } from '../services/api';
import { 
  predictEmotion, 
  isEmotionalMoment,
  createBiometricStream,
  BiometricData, 
} from '../services/MLEmotionDetection';
// import BiometricNotification from '../components/BiometricNotification';

export default function CaptureScreen() {
  const [emotion] = useState<EmotionType>('Excited');
  const [privacy, setPrivacy] = useState<'Private' | 'Friends' | 'Public'>('Private');
  const [saving, setSaving] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const navigate = useNavigate();
  const privacyOptions: ('Private' | 'Friends' | 'Public')[] = ['Private', 'Friends', 'Public'];
  
  const [currentBiometrics, setCurrentBiometrics] = useState<BiometricData | null>(null);
  const [mlEmotion, setMlEmotion] = useState<EmotionType>('Calm');
  const [mlIntensity, setMlIntensity] = useState(50);
  const [showNotification, setShowNotification] = useState(false);
  
  const [location, setLocation] = useState({
    name: 'University of Calgary',
    lat: 51.0447,
    lng: -114.0719
  });

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please allow camera permissions.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  }

  function takePicture() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }

  function retake() {
    setCapturedImage(null);
    startCamera();
  }

  useEffect(() => {
    // --- Effect 1: Geolocation ---
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
              {
                headers: {
                  'User-Agent': 'OurchiveApp/1.0 (contact@example.com)' 
                }
              }
            );
            
            if (!response.ok) throw new Error('Geocoding failed');
            
            const data = await response.json();
            setLocation({
              name: data.display_name?.split(',')[0] || 'Current Location',
              lat,
              lng
            });
          } catch (error) {
            console.warn('Location lookup failed:', error);
            setLocation({ name: 'Current Location', lat, lng });
          }
        },
        (error) => {
          console.log('Location permission denied/error:', error.message);
        }
      );
    }
  }, []); 

  useEffect(() => {
    // --- Effect 2: Biometrics ---
    console.log('🫀 Starting biometric monitoring...');
    
    const cleanup = createBiometricStream(async (biometrics) => {
      setCurrentBiometrics(biometrics);
      
      try {
        const prediction = await predictEmotion(biometrics);
        setMlEmotion(prediction.emotion);
        setMlIntensity(prediction.intensity);
        
        if (isEmotionalMoment(biometrics) && !showNotification && !capturedImage) {
          console.log('🎯 Emotional moment detected!');
          setShowNotification(true);
        }
      } catch (error) {
        console.error('ML prediction error:', error);
      }
    }, 3000); 
    
    return cleanup;
  }, [showNotification, capturedImage]); 

  async function handleSave() {
    setSaving(true);
    
    try {
      let imageFile: File | undefined = undefined;
      
      if (capturedImage) {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        imageFile = new File([blob], 'memory.jpg', { type: 'image/jpeg' });
      }
      
      await createMemory({
        emotion,
        intensity: 87,
        timestamp: new Date().toLocaleString(),
        location: location.name,
        latitude: location.lat,
        longitude: location.lng,
        heartRate: 105,
        privacy,
        image: imageFile, 
      });
      
      navigate('/feed');
    } catch (error) {
      console.error('Failed to save memory:', error);
      alert('Failed to save memory. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera View or Captured Image */}
      <div className="absolute inset-0">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </>
        )}
      </div>

      {/* Emotion Glow Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${emotionColors[emotion]} 100%)`
        }}
      />

      {/* Top Info Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-white">
            <button 
              onClick={() => {
                stopCamera();
                navigate('/feed');
              }}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
             <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: emotionColors[mlEmotion] }}
            />
               <span className="text-sm font-medium">{mlEmotion}</span>
               <span className="text-xs opacity-75">ML</span>
            </div>

             <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <Heart className="w-4 h-4 fill-current text-red-400" />
                <span className="text-sm font-medium">
                  {currentBiometrics?.heartRate || 70} BPM
               </span>
            </div>

              <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                <span className="text-sm font-medium">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>

            {!capturedImage && (
              <button 
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      {/* Center Capture/Save Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {!capturedImage ? (
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
              onClick={takePicture}
              disabled={!cameraActive}
              className="relative w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Camera className="w-10 h-10 text-gray-800" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent z-10">
        <div className="max-w-md mx-auto space-y-4">
          {/* Privacy Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-1">
              {privacyOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setPrivacy(option)}
                  disabled={saving}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    privacy === option
                      ? 'bg-white text-gray-800 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  } disabled:opacity-50`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {capturedImage ? (
            <div className="flex gap-3">
              <button
                onClick={retake}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-[15px] hover:bg-white/30 transition-all disabled:opacity-50"
              >
                Retake
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-b from-pink-300 to-pink-400 text-white rounded-full font-semibold text-[15px] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none" />
                <span className="relative">
                  {saving ? 'Saving...' : 'Save Memory'}
                </span>
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-white/80">
              {cameraActive ? 'Tap to capture this moment' : 'Starting camera...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}