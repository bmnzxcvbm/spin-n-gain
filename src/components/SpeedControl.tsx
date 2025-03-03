
import React from 'react';
import { Timer } from 'lucide-react';

interface SpeedControlProps {
  spinDuration: number;
  onSpinDurationChange: (duration: number) => void;
}

const SpeedControl: React.FC<SpeedControlProps> = ({
  spinDuration,
  onSpinDurationChange
}) => {
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onSpinDurationChange(value);
  };

  // Calculate labels for the slider
  const getSpeedLabel = (duration: number) => {
    if (duration < 3) return 'Fast';
    if (duration < 5) return 'Medium';
    return 'Slow';
  };

  return (
    <div className="glass rounded-xl p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-1.5">
            <Timer className="w-4 h-4" />
            <span>Spin Duration</span>
          </h2>
          <p className="text-sm text-primary/70">
            Adjust how long the wheel spins
          </p>
        </div>
        <div className="text-xl font-bold text-primary">
          {spinDuration.toFixed(1)}s
        </div>
      </div>
      
      {/* Custom slider track */}
      <div className="relative pt-2">
        <input
          type="range"
          min="2"
          max="8"
          step="0.5"
          value={spinDuration}
          onChange={handleRangeChange}
          className="
            appearance-none w-full h-2 rounded-full bg-primary/20
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-primary/20
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:shadow-primary/20
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
          "
        />
        
        {/* Speed labels */}
        <div className="flex justify-between text-xs font-medium text-primary/60 pt-2">
          <span>Fast</span>
          <span>Medium</span>
          <span>Slow</span>
        </div>
      </div>
      
      {/* Current selection indicator */}
      <div className="mt-3 text-center">
        <span className="
          inline-block px-3 py-1 rounded-full 
          bg-primary/10 text-primary text-sm font-medium
        ">
          {getSpeedLabel(spinDuration)}
        </span>
      </div>
    </div>
  );
};

export default SpeedControl;
