
import React, { useEffect, useState, useCallback } from 'react';
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
  
  // Use a callback to safely handle timer completion
  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Handle tick events safely
  const handleTick = useCallback((time: number) => {
    if (onTick) onTick(time);
  }, [onTick]);

  useEffect(() => {
    // Reset timer when not active
    if (!isActive) {
      setRemainingTime(duration);
      setProgress(100);
      return;
    }
    
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = prev - 1;
          const newProgress = (newTime / duration) * 100;
          
          // Update progress in the same cycle to avoid unnecessary re-renders
          setProgress(newProgress);
          
          // Notify parent of tick event
          if (newTime >= 0) {
            handleTick(newTime);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (remainingTime <= 0 && isActive) {
      handleComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, duration, remainingTime, handleComplete, handleTick]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-primary" />
      <div className="font-mono text-lg font-bold">{formatTime()}</div>
      <Progress 
        value={progress} 
        className="w-28 h-2" 
        indicatorClassName={progress < 20 ? "bg-red-500" : progress < 50 ? "bg-yellow-500" : "bg-green-500"} 
      />
    </div>
  );
};

export default Timer;
