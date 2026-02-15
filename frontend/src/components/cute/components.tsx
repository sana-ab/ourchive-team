import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Input Field Component
export function TextField({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange 
}: { 
  label: string; 
  type?: string; 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full">
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
      />
    </div>
  );
}

// Password Field with Show/Hide
export function PasswordField({ 
  label, 
  placeholder,
  value,
  onChange 
}: { 
  label: string; 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

// Primary Button (Glossy Pink)
export function PrimaryButton({ 
  children, 
  onClick,
  fullWidth = true 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} px-6 py-3 bg-gradient-to-b from-pink-300 to-pink-400 text-white rounded-full font-semibold text-[15px] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none" />
      <span className="relative">{children}</span>
    </button>
  );
}

// Segmented Control for Sign Up / Log In
export function SegmentedControl({ 
  options, 
  selected, 
  onChange 
}: { 
  options: string[]; 
  selected: string; 
  onChange: (option: string) => void;
}) {
  return (
    <div className="flex bg-gray-100 rounded-full p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 px-6 py-2 rounded-full text-[14px] font-semibold transition-all ${
            selected === option
              ? 'bg-white text-pink-500 shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// Window-style Card
export function WindowCard({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md bg-white rounded-[20px] shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-pink-100 to-blue-100 px-5 py-3 flex items-center justify-between border-b border-gray-200">
        <h2 className="font-semibold text-[15px] text-gray-800">{title}</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-purple-300" />
        </div>
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Social Login Button
export function SocialButton({ 
  icon, 
  provider,
  onClick 
}: { 
  icon: React.ReactNode; 
  provider: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-md transition-all"
    >
      {icon}
      <span className="text-[13px] font-medium text-gray-700">{provider}</span>
    </button>
  );
}

// Sparkle decoration component
export function Sparkles() {
  return (
    <>
      <div className="absolute top-12 left-8 w-4 h-4 text-pink-300 opacity-60 animate-pulse">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
      
      <div className="absolute top-20 right-12 w-3 h-3 text-blue-300 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
      
      <div className="absolute bottom-16 left-16 w-3.5 h-3.5 text-purple-300 opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    </>
  );
}

// Background with gradient and subtle pattern
export function CuteBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-pink-100 to-pink-200 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      <Sparkles />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}