
import React from 'react';
import { Button } from "@/components/ui/button";
import { calculateAccuracy, calculateWPM } from '@/utils/typingUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Trophy, Target, Medal, Keyboard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

  const getProgressColor = (value: number) => {
    if (value < 50) return "bg-red-500";
    if (value < 85) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getScoreMessage = () => {
    if (totalScore >= 85) return 'Outstanding performance!';
    if (totalScore >= 70) return 'Great job!';
    if (totalScore >= 50) return 'Good effort!';
    return 'Keep practicing!';
  };

  const getRank = () => {
    if (totalScore >= 90) return 'Master Coder';
    if (totalScore >= 80) return 'Expert Coder';
    if (totalScore >= 70) return 'Advanced Coder';
    if (totalScore >= 60) return 'Skilled Coder';
    if (totalScore >= 50) return 'Proficient Coder';
    if (totalScore >= 40) return 'Intermediate Coder';
    return 'Beginner Coder';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-secondary/10 backdrop-blur-sm border border-secondary/30">
      <CardHeader className="bg-gradient-to-r from-secondary/30 to-primary/20 rounded-t-lg pb-6">
        <CardTitle className="text-3xl flex items-center gap-3">
          <Trophy className="text-yellow-500" />
          <div className="bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
            Results for {userName}
          </div>
        </CardTitle>
        <CardDescription className="text-base">
          Your typing challenge performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8 pt-6">
        <div className="bg-secondary/30 p-6 rounded-lg">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-primary/90">Your Rank: {getRank()}</h3>
            <p className="text-muted-foreground">{getScoreMessage()}</p>
          </div>
        
          <div className="flex flex-col md:flex-row justify-around gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-secondary/50 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="text-sm text-muted-foreground uppercase">Accuracy</h4>
              <p className={`text-4xl font-bold ${getAccuracyColor()}`}>{accuracy}%</p>
              <Progress 
                value={accuracy} 
                className={`w-32 h-2 ${getProgressColor(accuracy)}`}
              />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-secondary/50 text-primary">
                <Keyboard className="h-6 w-6" />
              </div>
              <h4 className="text-sm text-muted-foreground uppercase">Typing Speed</h4>
              <p className={`text-4xl font-bold ${getWpmColor()}`}>{wpm} <span className="text-lg">WPM</span></p>
              <Progress 
                value={Math.min(wpm, 100)} 
                className={`w-32 h-2 ${getProgressColor(Math.min(wpm, 100))}`}
              />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-secondary/50 text-primary">
                <Medal className="h-6 w-6" />
              </div>
              <h4 className="text-sm text-muted-foreground uppercase">Total Score</h4>
              <p className={`text-4xl font-bold ${getScoreColor()}`}>{totalScore}</p>
              <Progress 
                value={totalScore} 
                className={`w-32 h-2 ${getProgressColor(totalScore)}`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-secondary pb-2">Challenge Stats</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Total characters:</span>
                <span className="font-mono">{typedText.length}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Correct characters:</span>
                <span className="font-mono text-green-400">{Math.floor(accuracy * typedText.length / 100)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Errors:</span>
                <span className="font-mono text-red-400">{typedText.length - Math.floor(accuracy * typedText.length / 100)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Challenge time:</span>
                <span className="font-mono">3 minutes</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b border-secondary pb-2">Performance Insights</h3>
            <div className="space-y-3">
              <p className="text-sm">
                {accuracy >= 90 ? 
                  "Your accuracy is outstanding! You have excellent precision in your typing." : 
                  accuracy >= 75 ? 
                  "Good accuracy! With more practice, you can reduce your error rate further." : 
                  "Focus on accuracy before speed. Try to type more carefully."}
              </p>
              <p className="text-sm">
                {wpm >= 50 ? 
                  "Your typing speed is impressive! You're well above average." : 
                  wpm >= 30 ? 
                  "You have a good typing speed. Regular practice will help you improve further." : 
                  "Keep practicing to build up your typing speed. Focus on finger positioning."}
              </p>
              <p className="text-sm">
                {totalScore >= 80 ? 
                  "Overall, you demonstrate excellent typing skills!" : 
                  totalScore >= 60 ? 
                  "You're on the right track. Keep practicing to refine your skills." : 
                  "Regular practice will help you improve both speed and accuracy."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 pt-6">
        <Button onClick={onRestart} className="w-full gap-2" size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Try Again
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Practice regularly to improve your typing skills!
        </p>
      </CardFooter>
    </Card>
  );
};

export default ResultsDisplay;
