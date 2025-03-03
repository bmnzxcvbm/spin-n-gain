
import React, { useState, useEffect, useRef } from 'react';
import { CirclePlay, Volume2, VolumeX } from 'lucide-react';
import { playSound, stopSound, toggleMute, getMuteState } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

interface RouletteProps {
  options: string[];
  spinDuration: number;
  onSpinComplete: (winner: string) => void;
}

const Roulette: React.FC<RouletteProps> = ({ 
  options, 
  spinDuration,
  onSpinComplete 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(() => getMuteState());
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Reset winner whenever options change
  useEffect(() => {
    if (!isSpinning) {
      setWinner(null);
    }
  }, [options, isSpinning]);

  // Calculate style for each option based on position in circle
  const getOptionStyle = (index: number, total: number) => {
    const angle = (360 / total) * index;
    const color = index % 2 === 0 ? 'bg-primary/10' : 'bg-primary/5';
    const borderColor = index % 2 === 0 ? 'border-primary/20' : 'border-primary/15';
    
    return {
      transform: `rotateZ(${angle}deg) translateY(-50%)`,
      className: `option-item ${color} ${borderColor} border`,
    };
  };

  // Handle spin button click
  const handleSpin = () => {
    if (isSpinning || options.length === 0) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    // Play spin sound
    playSound('spin');
    
    // Random number of full rotations (3-5 full spins) plus random final position
    const spinAngle = 
      1080 + // Minimum 3 full rotations (3 * 360 = 1080 degrees)
      Math.floor(Math.random() * 720) + // Additional 0-2 rotations
      Math.floor(Math.random() * 360); // Random final position
    
    // Calculate which option will be the winner based on final position
    const normalizedAngle = spinAngle % 360;
    const optionAngle = 360 / options.length;
    const winnerIndex = Math.floor(normalizedAngle / optionAngle);
    const winningOption = options[options.length - 1 - winnerIndex];
    
    // Set the wheel's CSS variables for spin duration and angle
    if (wheelRef.current) {
      wheelRef.current.style.setProperty('--spin-duration', `${spinDuration}s`);
      wheelRef.current.style.setProperty('--spin-angle', `${spinAngle}deg`);
      
      // Force a reflow before adding the spinning class
      void wheelRef.current.offsetWidth;
      wheelRef.current.classList.add('spinning');
    }
    
    // Set new rotation angle for after animation completes
    setRotation(spinAngle);
    
    // Wait for spin to complete
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winningOption);
      onSpinComplete(winningOption);
      
      // Remove spinning class
      if (wheelRef.current) {
        wheelRef.current.classList.remove('spinning');
        // Set the final rotation directly
        wheelRef.current.style.transform = `rotate(${spinAngle}deg)`;
      }
      
      // Stop spin sound, play win sound
      stopSound('spin');
      playSound('win');
      
      // Trigger confetti at the result element's position
      if (resultRef.current) {
        const rect = resultRef.current.getBoundingClientRect();
        launchConfetti({
          origin: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          }
        });
      }
    }, spinDuration * 1000);
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    const newMuteState = toggleMute();
    setIsMuted(newMuteState);
  };

  return (
    <div className="roulette-container flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Sound control button */}
      <button 
        onClick={handleMuteToggle}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary/10 transition-colors"
        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {isMuted ? (
          <VolumeX className="text-primary/80 w-5 h-5" />
        ) : (
          <Volume2 className="text-primary/80 w-5 h-5" />
        )}
      </button>
      
      {/* Winner display */}
      <div 
        ref={resultRef}
        className={`glass rounded-xl px-8 py-4 text-center transition-all duration-500 w-full 
                     ${winner ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                     ${isSpinning ? 'pointer-events-none' : ''}`}
      >
        {winner ? (
          <div className="animate-fade-in">
            <div className="text-sm text-primary/80 font-medium mb-1">Winner</div>
            <div className="text-2xl font-bold text-primary">{winner}</div>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center text-primary/50">
            {isSpinning ? "Spinning..." : "Spin the wheel to find a winner"}
          </div>
        )}
      </div>
      
      {/* Roulette wheel */}
      <div className="relative w-full aspect-square mb-8">
        {/* Center point */}
        <div className="absolute left-1/2 top-1/2 w-8 h-8 -ml-4 -mt-4 rounded-full bg-primary z-10 shadow-lg"></div>
        
        {/* Indicator */}
        <div className="absolute left-1/2 -top-4 w-8 h-12 -ml-4 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary mx-auto"></div>
        </div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className={`roulette-wheel absolute inset-5 rounded-full border-4 border-primary/30 overflow-hidden 
                      shadow-2xl transition-transform`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Options */}
          {options.length > 0 ? (
            options.map((option, index) => {
              const { transform, className } = getOptionStyle(index, options.length);
              return (
                <div 
                  key={index} 
                  className={className}
                  style={{ transform }}
                >
                  <span className="transform -rotate-[inherit] font-medium">
                    {option}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-center p-4 text-primary/50">
              Add options to get started
            </div>
          )}
        </div>
      </div>
      
      {/* Spin button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || options.length < 2}
        className={`
          relative flex items-center justify-center gap-2 
          bg-primary text-white px-8 py-3 rounded-full text-lg font-medium
          shadow-lg transform transition-all duration-200
          ${isSpinning ? 
            'opacity-50 cursor-not-allowed' : 
            'hover:shadow-primary/20 hover:-translate-y-1'
          }
          ${options.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <CirclePlay className="w-5 h-5" />
        <span>{isSpinning ? 'Spinning...' : 'Spin the Wheel'}</span>
        {/* Glow effect behind button */}
        <div className="absolute inset-0 -z-10 bg-primary/20 rounded-full blur-xl transform scale-90 opacity-70"></div>
      </button>
    </div>
  );
};

export default Roulette;
