
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  isActive: boolean;
  onComplete: () => void;
  onTick?: (remainingTime: number) => void;
}

const Timer: React.FC<TimerProps> = ({ duration, isActive, onComplete, onTick }) => {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = prev - 1;
          if (onTick) onTick(newTime);
          return newTime;
        });
        setProgress((remainingTime - 1) / duration * 100);
      }, 1000);
    } else if (remainingTime === 0 && isActive) {
      onComplete();
    }
    
    if (!isActive) {
      setRemainingTime(duration);
      setProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [remainingTime, isActive, duration, onComplete, onTick]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-4 w-4" />
      <div className="font-mono text-lg">{formatTime()}</div>
      <Progress value={progress} className="w-24" />
    </div>
  );
};

export default Timer;
