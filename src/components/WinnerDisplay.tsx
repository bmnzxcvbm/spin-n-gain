
import React from 'react';
import { Crown, XCircle, History } from 'lucide-react';

interface WinnerDisplayProps {
  winners: string[];
  onRemoveWinner: (index: number) => void;
  onClearHistory: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winners,
  onRemoveWinner,
  onClearHistory
}) => {
  if (winners.length === 0) {
    return null;
  }

  return (
    <div className="glass rounded-xl p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <History className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Winners History</h2>
        </div>
        
        <button
          onClick={onClearHistory}
          className="
            text-xs px-2 py-1 rounded-md bg-primary/10 
            text-primary hover:bg-primary/20 transition-colors
          "
        >
          Clear History
        </button>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {winners.map((winner, index) => (
          <div 
            key={index} 
            className={`
              flex items-center justify-between
              bg-white/60 px-4 py-3 rounded-lg 
              border border-primary/10
              ${index === 0 ? 'bg-primary/10 border-primary/30' : ''}
              animate-fade-in
            `}
          >
            <div className="flex items-center gap-2">
              {index === 0 && (
                <Crown className="w-4 h-4 text-primary" />
              )}
              <span className={index === 0 ? "font-medium" : ""}>
                {winner}
              </span>
            </div>
            
            <button
              onClick={() => onRemoveWinner(index)}
              className="
                text-primary/40 hover:text-red-500 
                p-1 rounded-full transition-colors
              "
              aria-label={`Remove ${winner} from history`}
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnerDisplay;
