
import React, { useState, useEffect } from 'react';
import Roulette from '../components/Roulette';
import OptionInput from '../components/OptionInput';
import SpeedControl from '../components/SpeedControl';
import WinnerDisplay from '../components/WinnerDisplay';
import { initAudio } from '../utils/audio';
import { toast } from "sonner";
import { ChevronUp, ChevronDown } from 'lucide-react';

const Index = () => {
  const [options, setOptions] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  const [spinDuration, setSpinDuration] = useState(5);
  const [mobileSectionOpen, setMobileSectionOpen] = useState<'options' | 'controls' | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    initAudio();
  }, []);

  // Add a new option to the wheel
  const handleAddOption = (option: string) => {
    setOptions(prev => [...prev, option]);
    toast(`Added: ${option}`);
  };

  // Remove an option from the wheel
  const handleRemoveOption = (index: number) => {
    const optionToRemove = options[index];
    setOptions(prev => prev.filter((_, i) => i !== index));
    toast(`Removed: ${optionToRemove}`);
  };

  // Clear all options
  const handleClearOptions = () => {
    if (options.length === 0) return;
    
    setOptions([]);
    toast('All options cleared');
  };

  // Handle spin completion
  const handleSpinComplete = (winner: string) => {
    setWinners(prev => [winner, ...prev]);
    toast(`Winner: ${winner}! 🎉`, {
      duration: 5000,
    });
  };

  // Remove a winner from history
  const handleRemoveWinner = (index: number) => {
    setWinners(prev => prev.filter((_, i) => i !== index));
  };

  // Clear winners history
  const handleClearHistory = () => {
    setWinners([]);
    toast('Winners history cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Header */}
      <header className="glass border-none shadow-sm py-6 px-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Spin <span className="text-accent">&</span> Win
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* Desktop layout */}
          <div className="hidden md:grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <OptionInput
                options={options}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                onClearOptions={handleClearOptions}
              />
              
              <SpeedControl
                spinDuration={spinDuration}
                onSpinDurationChange={setSpinDuration}
              />
              
              <WinnerDisplay
                winners={winners}
                onRemoveWinner={handleRemoveWinner}
                onClearHistory={handleClearHistory}
              />
            </div>
            
            <div className="flex flex-col items-center justify-center py-6">
              <Roulette
                options={options}
                spinDuration={spinDuration}
                onSpinComplete={handleSpinComplete}
              />
            </div>
          </div>
          
          {/* Mobile layout */}
          <div className="md:hidden space-y-8">
            {/* Roulette wheel */}
            <div className="py-4">
              <Roulette
                options={options}
                spinDuration={spinDuration}
                onSpinComplete={handleSpinComplete}
              />
            </div>
            
            {/* Collapsible Options section */}
            <div className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setMobileSectionOpen(
                  mobileSectionOpen === 'options' ? null : 'options'
                )}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-primary"
              >
                <span>Options</span>
                {mobileSectionOpen === 'options' ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {mobileSectionOpen === 'options' && (
                <div className="p-4 pt-0">
                  <OptionInput
                    options={options}
                    onAddOption={handleAddOption}
                    onRemoveOption={handleRemoveOption}
                    onClearOptions={handleClearOptions}
                  />
                </div>
              )}
            </div>
            
            {/* Collapsible Controls section */}
            <div className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setMobileSectionOpen(
                  mobileSectionOpen === 'controls' ? null : 'controls'
                )}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-primary"
              >
                <span>Controls</span>
                {mobileSectionOpen === 'controls' ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {mobileSectionOpen === 'controls' && (
                <div className="p-4 pt-0 space-y-6">
                  <SpeedControl
                    spinDuration={spinDuration}
                    onSpinDurationChange={setSpinDuration}
                  />
                  
                  <WinnerDisplay
                    winners={winners}
                    onRemoveWinner={handleRemoveWinner}
                    onClearHistory={handleClearHistory}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/50 py-4 mt-16">
        <div className="container mx-auto text-center text-sm text-primary/60">
          <p>© {new Date().getFullYear()} Spin & Win — An elegant roulette experience</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
