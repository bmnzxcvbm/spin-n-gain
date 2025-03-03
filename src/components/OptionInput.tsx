
import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';

interface OptionInputProps {
  options: string[];
  onAddOption: (option: string) => void;
  onRemoveOption: (index: number) => void;
  onClearOptions: () => void;
}

const OptionInput: React.FC<OptionInputProps> = ({
  options,
  onAddOption,
  onRemoveOption,
  onClearOptions
}) => {
  const [newOption, setNewOption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(e.target.value);
    if (error) setError(null);
  };

  const handleAddOption = () => {
    const trimmedOption = newOption.trim();
    
    // Validate input
    if (!trimmedOption) {
      setError('Please enter an option');
      return;
    }
    
    if (options.includes(trimmedOption)) {
      setError('This option already exists');
      return;
    }
    
    // Add option and reset input
    onAddOption(trimmedOption);
    setNewOption('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="glass rounded-xl p-6 w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-primary">Add Your Options</h2>
        <p className="text-sm text-primary/70">
          Add at least 2 options to spin the wheel
        </p>
      </div>
      
      {/* Input area */}
      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={newOption}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter an option..."
            className={`
              w-full px-4 py-3 rounded-lg border bg-white/80 
              focus:outline-none focus:ring-2 focus:ring-primary/30
              transition-all duration-200
              ${error ? 'border-red-500' : 'border-primary/20'}
            `}
          />
          {error && (
            <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAddOption}
            className="
              flex-1 flex items-center justify-center gap-1.5 
              bg-primary/10 text-primary px-4 py-2.5 rounded-lg 
              font-medium hover:bg-primary/20 transition-colors
            "
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Option</span>
          </button>
          
          <button
            onClick={onClearOptions}
            disabled={options.length === 0}
            className={`
              flex items-center justify-center gap-1.5 
              bg-red-500/10 text-red-500 px-4 py-2 rounded-lg 
              font-medium transition-colors
              ${options.length === 0 ? 
                'opacity-50 cursor-not-allowed' : 
                'hover:bg-red-500/20'
              }
            `}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>
      
      {/* Options list */}
      {options.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-medium text-primary/70">
            Your Options ({options.length})
          </h3>
          <ul className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {options.map((option, index) => (
              <li 
                key={index} 
                className="
                  flex items-center justify-between
                  bg-white/60 px-4 py-2.5 rounded-lg 
                  border border-primary/10 animate-fade-in
                "
              >
                <span className="truncate">{option}</span>
                <button
                  onClick={() => onRemoveOption(index)}
                  className="
                    text-primary/40 hover:text-red-500 
                    p-1 rounded-full transition-colors
                  "
                  aria-label={`Remove ${option}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OptionInput;
