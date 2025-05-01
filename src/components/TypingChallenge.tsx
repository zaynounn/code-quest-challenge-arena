
import React, { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
import { calculateAccuracy, calculateWPM } from '@/utils/typingUtils';
import { Button } from '@/components/ui/button';

interface TypingChallengeProps {
  codeText: string;
  onComplete: (typedText: string) => void;
}

const TypingChallenge: React.FC<TypingChallengeProps> = ({ codeText, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const CHALLENGE_DURATION = 180; // 3 minutes in seconds

  useEffect(() => {
    // Calculate accuracy whenever typed text changes
    if (typedText.length > 0) {
      const currentAccuracy = calculateAccuracy(codeText, typedText);
      setAccuracy(currentAccuracy);
      
      // Calculate WPM
      const currentWpm = calculateWPM(codeText, typedText, timeElapsed || 1);
      setWpm(currentWpm);
      
      // Calculate total score (combination of accuracy and wpm)
      setTotalScore(Math.floor(currentAccuracy * 0.6 + currentWpm * 0.4));
    }
  }, [typedText, codeText, timeElapsed]);

  const handleStartChallenge = () => {
    setIsActive(true);
    setTypedText('');
    setTimeElapsed(0);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent tab from moving focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const cursorPosition = textarea.selectionStart || 0;
      const value = typedText;
      const newValue = 
        value.substring(0, cursorPosition) + '  ' + 
        value.substring(cursorPosition);
      
      setTypedText(newValue);
      
      // Set cursor position after inserted tab
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = cursorPosition + 2;
          inputRef.current.selectionEnd = cursorPosition + 2;
        }
      }, 0);
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    onComplete(typedText);
  };

  const handleTimerTick = (remainingTime: number) => {
    setTimeElapsed(CHALLENGE_DURATION - remainingTime);
  };

  // Render code with highlighting based on user input
  const renderCode = () => {
    return codeText.split('').map((char, index) => {
      let className = "code-character";
      
      if (index < typedText.length) {
        if (typedText[index] === char) {
          className += " correct";
        } else {
          className += " incorrect";
        }
      }
      
      // Mark current character
      if (index === typedText.length) {
        className += " current";
      }
      
      // Replace spaces with visible spaces
      const displayChar = char === ' ' ? ' ' : char;
      
      return (
        <span key={index} className={className}>
          {displayChar}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="text-lg font-bold">
          Accuracy: <span className={accuracy < 50 ? 'text-red-400' : (accuracy < 85 ? 'text-yellow-400' : 'text-green-400')}>
            {accuracy}%
          </span>
        </div>
        
        <div className="text-lg font-bold">
          WPM: <span className={wpm < 20 ? 'text-red-400' : (wpm < 40 ? 'text-yellow-400' : 'text-green-400')}>
            {wpm}
          </span>
        </div>
        
        <div className="text-lg font-bold">
          Total Score: <span className={totalScore < 50 ? 'text-red-400' : (totalScore < 70 ? 'text-yellow-400' : 'text-green-400')}>
            {totalScore}
          </span>
        </div>
        
        <Timer 
          duration={CHALLENGE_DURATION} 
          onComplete={handleTimerComplete} 
          onTick={handleTimerTick}
          isActive={isActive} 
        />
        
        {!isActive && (
          <Button onClick={handleStartChallenge}>
            Start Challenge
          </Button>
        )}
      </div>
      
      <div className="relative overflow-hidden">
        <div 
          className="p-6 bg-code rounded-lg overflow-y-auto max-h-[500px] shadow-lg"
          ref={codeBlockRef}
        >
          <pre className="code-block">
            {renderCode()}
          </pre>
          
          <textarea
            ref={inputRef}
            value={typedText}
            onChange={(e) => isActive && setTypedText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isActive}
            className="code-input"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
};

export default TypingChallenge;
