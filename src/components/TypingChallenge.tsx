
import React, { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
import { calculateAccuracy } from '@/utils/typingUtils';
import { Button } from '@/components/ui/button';

interface TypingChallengeProps {
  codeText: string;
  onComplete: (typedText: string) => void;
}

const TypingChallenge: React.FC<TypingChallengeProps> = ({ codeText, onComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const CHALLENGE_DURATION = 180; // 3 minutes in seconds

  useEffect(() => {
    // Calculate accuracy whenever typed text changes
    if (typedText.length > 0) {
      setAccuracy(calculateAccuracy(codeText, typedText));
    }
  }, [typedText, codeText]);

  const handleStartChallenge = () => {
    setIsActive(true);
    setTypedText('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent tab from moving focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const cursorPosition = e.currentTarget.selectionStart || 0;
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
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">
          Accuracy: <span className={accuracy < 50 ? 'text-red-400' : (accuracy < 85 ? 'text-yellow-400' : 'text-green-400')}>
            {accuracy}%
          </span>
        </div>
        
        <Timer 
          duration={CHALLENGE_DURATION} 
          onComplete={handleTimerComplete} 
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
