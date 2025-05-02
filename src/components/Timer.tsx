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
  const [lastActiveTime, setLastActiveTime] = useState<number | null>(null);
  
  // Use a callback to safely handle timer completion
  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Handle tick events safely
  const handleTick = useCallback((time: number) => {
    if (onTick) onTick(time);
  }, [onTick]);

  useEffect(() => {
    // When the timer becomes active, record the current time
    if (isActive && lastActiveTime === null) {
      setLastActiveTime(Date.now());
    }
    
    // Reset timer when not active and not paused
    if (!isActive && lastActiveTime === null) {
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
      
      // When timer becomes inactive but not completed (paused), keep the lastActiveTime
      if (!isActive && lastActiveTime !== null && remainingTime > 0) {
        // We're pausing, don't reset lastActiveTime
      } else if (!isActive) {
        // Timer completed or reset
        setLastActiveTime(null);
      }
    };
  }, [isActive, duration, remainingTime, handleComplete, handleTick, lastActiveTime]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (progress < 20) return "bg-red-500";
    if (progress < 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-primary" />
      <div className="font-mono text-lg font-bold">{formatTime()}</div>
      <Progress 
        value={progress} 
        className={`w-28 h-2 ${getProgressColor()}`}
      />
    </div>
  );
};

export default Timer;
