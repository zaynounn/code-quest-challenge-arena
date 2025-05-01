
import React, { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
import { calculateAccuracy, calculateWPM } from '@/utils/typingUtils';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle } from 'lucide-react';

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
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [focusLine, setFocusLine] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const CHALLENGE_DURATION = 180; // 3 minutes in seconds

  // Generate line numbers when code changes
  useEffect(() => {
    const lines = codeText.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => (i + 1).toString()));
  }, [codeText]);

  // Calculate current line based on typed text
  useEffect(() => {
    if (typedText && codeText) {
      const typedLines = typedText.split('\n').length;
      setFocusLine(typedLines - 1); // 0-indexed
    }
  }, [typedText, codeText]);

  // Auto-scroll code block as user types
  useEffect(() => {
    if (codeBlockRef.current && focusLine > 0) {
      const lineHeight = 24; // approximate height of a line in pixels
      codeBlockRef.current.scrollTop = (focusLine - 5) * lineHeight; // keep 5 lines above visible
    }
  }, [focusLine]);

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
    setIsPaused(false);
    setTypedText('');
    setTimeElapsed(0);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (isPaused && inputRef.current) {
      inputRef.current.focus();
    }
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
    if (!isPaused) {
      setTimeElapsed(CHALLENGE_DURATION - remainingTime);
    }
  };

  // Render code with highlighting based on user input
  const renderCode = () => {
    const codeLines = codeText.split('\n');
    const typedLines = typedText.split('\n');

    return codeLines.map((line, lineIndex) => {
      const chars = line.split('');
      const typedLine = typedLines[lineIndex] || '';
      
      return (
        <div key={lineIndex} className={`flex ${focusLine === lineIndex ? 'bg-secondary/30' : ''}`}>
          <div className="text-muted-foreground w-8 text-right pr-2 select-none">
            {lineIndex + 1}
          </div>
          <div className="code-line flex-1">
            {chars.map((char, charIndex) => {
              let className = "code-character";
              
              if (lineIndex < typedLines.length) {
                if (charIndex < typedLine.length) {
                  if (typedLine[charIndex] === char) {
                    className += " correct";
                  } else {
                    className += " incorrect";
                  }
                } else if (lineIndex === focusLine && charIndex === typedLine.length) {
                  className += " current";
                }
              }
              
              // Replace spaces with visible spaces
              const displayChar = char === ' ' ? ' ' : char;
              
              return (
                <span key={charIndex} className={className}>
                  {displayChar}
                </span>
              );
            })}
            {/* Show cursor at current position */}
            {lineIndex === focusLine && chars.length === typedLines[focusLine].length && (
              <span className="code-character current"></span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3 bg-secondary/20 p-3 rounded-lg backdrop-blur-sm">
        <div className="stat-item">
          <div className="text-xs text-muted-foreground uppercase">Accuracy</div>
          <div className={`text-lg font-bold ${accuracy < 50 ? 'text-red-400' : (accuracy < 85 ? 'text-yellow-400' : 'text-green-400')}`}>
            {accuracy}%
          </div>
        </div>
        
        <div className="stat-item">
          <div className="text-xs text-muted-foreground uppercase">Speed</div>
          <div className={`text-lg font-bold ${wpm < 20 ? 'text-red-400' : (wpm < 40 ? 'text-yellow-400' : 'text-green-400')}`}>
            {wpm} WPM
          </div>
        </div>
        
        <div className="stat-item">
          <div className="text-xs text-muted-foreground uppercase">Score</div>
          <div className={`text-lg font-bold ${totalScore < 50 ? 'text-red-400' : (totalScore < 70 ? 'text-yellow-400' : 'text-green-400')}`}>
            {totalScore}
          </div>
        </div>
        
        <Timer 
          duration={CHALLENGE_DURATION} 
          onComplete={handleTimerComplete} 
          onTick={handleTimerTick}
          isActive={isActive && !isPaused} 
        />
        
        <div>
          {!isActive ? (
            <Button onClick={handleStartChallenge} className="gap-2">
              <PlayCircle className="h-5 w-5" />
              Start Challenge
            </Button>
          ) : (
            <Button onClick={handlePauseResume} variant="outline" className="gap-2">
              {isPaused ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative overflow-hidden border border-secondary rounded-lg">
        <div 
          className="p-6 bg-code rounded-lg overflow-y-auto max-h-[500px] shadow-lg font-mono text-sm"
          ref={codeBlockRef}
        >
          <div className="code-block flex flex-col">
            {renderCode()}
          </div>
          
          <textarea
            ref={inputRef}
            value={typedText}
            onChange={(e) => isActive && !isPaused && setTypedText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isActive || isPaused}
            className="code-input"
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Tips: Press Tab to insert 2 spaces. Type exactly as shown including all symbols and whitespace.</p>
      </div>
    </div>
  );
};

export default TypingChallenge;
