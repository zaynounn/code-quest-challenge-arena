
import React from 'react';
import { calculateAccuracy, calculateWPM } from '@/utils/typingUtils';
import { Button } from '@/components/ui/button';

interface ResultsDisplayProps {
  originalText: string;
  typedText: string;
  userName: string;
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  originalText,
  typedText,
  userName,
  onRestart,
}) => {
  const accuracy = calculateAccuracy(originalText, typedText);
  const wpm = calculateWPM(originalText, typedText, 180); // 3 minutes = 180 seconds
  const charactersTyped = typedText.length;
  const totalCharacters = originalText.length;
  const percentageCompleted = Math.floor((charactersTyped / totalCharacters) * 100);

  // Determine performance level
  let performanceLevel = "Beginner";
  if (accuracy > 95 && wpm > 60) {
    performanceLevel = "Expert";
  } else if (accuracy > 90 && wpm > 45) {
    performanceLevel = "Advanced";
  } else if (accuracy > 80 && wpm > 30) {
    performanceLevel = "Intermediate";
  }

  return (
    <div className="w-full max-w-lg p-8 bg-secondary/50 rounded-lg shadow-lg border border-secondary backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-center mb-6">Challenge Results</h2>
      
      <div className="text-center mb-4">
        <p className="text-lg">Great job, <span className="font-semibold">{userName}</span>!</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-2xl font-bold">{accuracy}%</div>
          </div>
          
          <div className="bg-background p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Speed</div>
            <div className="text-2xl font-bold">{wpm} WPM</div>
          </div>
          
          <div className="bg-background p-4 rounded-lg col-span-2">
            <div className="text-sm text-muted-foreground">Completion</div>
            <div className="mt-1 mb-2 font-bold">{percentageCompleted}%</div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${percentageCompleted}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-background p-4 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Performance Level</div>
          <div className="text-xl font-bold">{performanceLevel}</div>
        </div>
        
        <Button onClick={onRestart} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
