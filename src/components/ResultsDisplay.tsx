
import React from 'react';
import { Button } from '@/components/ui/button';
import { calculateAccuracy, calculateWPM } from '@/utils/typingUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Trophy } from 'lucide-react';

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
  const wpm = calculateWPM(originalText, typedText, 180); // 3 minutes
  const totalScore = Math.floor(accuracy * 0.6 + wpm * 0.4); // 60% accuracy, 40% speed
  
  const getAccuracyColor = () => {
    if (accuracy >= 85) return 'text-green-500';
    if (accuracy >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getWpmColor = () => {
    if (wpm >= 40) return 'text-green-500';
    if (wpm >= 20) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreColor = () => {
    if (totalScore >= 70) return 'text-green-500';
    if (totalScore >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreMessage = () => {
    if (totalScore >= 85) return 'Outstanding performance!';
    if (totalScore >= 70) return 'Great job!';
    if (totalScore >= 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Results for {userName}
        </CardTitle>
        <CardDescription>
          Here's how you performed in the coding challenge
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-muted-foreground text-sm uppercase mb-2">Accuracy</h3>
            <p className={`text-3xl font-bold ${getAccuracyColor()}`}>{accuracy}%</p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-muted-foreground text-sm uppercase mb-2">Typing Speed</h3>
            <p className={`text-3xl font-bold ${getWpmColor()}`}>{wpm} WPM</p>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-muted-foreground text-sm uppercase mb-2">Total Score</h3>
            <p className={`text-3xl font-bold ${getScoreColor()}`}>{totalScore}</p>
            <p className="text-sm mt-2">{getScoreMessage()}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-3">Challenge Breakdown:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Total characters typed: <strong>{typedText.length}</strong></li>
            <li>Correct characters: <strong>{Math.floor(accuracy * typedText.length / 100)}</strong></li>
            <li>Errors: <strong>{typedText.length - Math.floor(accuracy * typedText.length / 100)}</strong></li>
            <li>Challenge time: <strong>3 minutes</strong></li>
          </ul>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={onRestart} className="w-full" variant="default">
          <RefreshCw className="mr-2" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultsDisplay;
