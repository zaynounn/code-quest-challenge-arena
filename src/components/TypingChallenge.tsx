
import React, { useState, useRef, useEffect } from 'react';
import Timer from './Timer';
import { calculateAccuracy, calculateWPM } from '@/utils/typingUtils';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TypingChallengeProps {
  codeText: string;
  onComplete: (typedText: string) => void;
  onBack?: () => void;
}

const TypingChallenge: React.FC<TypingChallengeProps> = ({ codeText, onComplete, onBack }) => {
  const [typedText, setTypedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [focusLine, setFocusLine] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, char: 0 });
  const [savedTimeElapsed, setSavedTimeElapsed] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const CHALLENGE_DURATION = 180; // 3 minutes in seconds

  // Generate line numbers when code changes
  useEffect(() => {
    const lines = codeText.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => (i + 1).toString()));
  }, [codeText]);

  // Calculate current line and character position based on typed text
  useEffect(() => {
    if (typedText) {
      const lines = typedText.split('\n');
      const currentLineIndex = lines.length - 1;
      const currentCharIndex = lines[currentLineIndex]?.length || 0;
      
      setFocusLine(currentLineIndex);
      setCursorPosition({ 
        line: currentLineIndex, 
        char: currentCharIndex 
      });
    } else {
      setFocusLine(0);
      setCursorPosition({ line: 0, char: 0 });
    }
  }, [typedText]);

  // Auto-scroll code block as user types
  useEffect(() => {
    if (codeBlockRef.current && focusLine > 2) {
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
    setSavedTimeElapsed(0);
    setTimeElapsed(0);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsActive(true);
    }
    setIsPaused(!isPaused);
    
    if (isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBackClick = () => {
    setIsActive(false);
    setIsPaused(false);
    setTypedText('');
    setTimeElapsed(0);
    setSavedTimeElapsed(0);
    if (onBack) {
      onBack();
    }
  };

  // Auto-indentation and tab handling
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      
      // Get previous line indentation
      const lines = typedText.split('\n');
      const currentLine = lines[lines.length - 1] || '';
      
      // Count leading spaces in the current line
      let indent = '';
      for (let i = 0; i < currentLine.length; i++) {
        if (currentLine[i] === ' ') {
          indent += ' ';
        } else {
          break;
        }
      }
      
      // Check if we need to increase indentation (after { or if line ends with { or with special keywords)
      if (currentLine.trim().endsWith('{') || 
          /\b(if|for|while|else|try|catch|class|interface)\b.*[^{;]$/.test(currentLine.trim())) {
        indent += '  '; // Add 2 more spaces for auto-indent
      }
      
      // Apply the new line with indentation
      const newText = typedText + '\n' + indent;
      setTypedText(newText);
    }
  };

  // Update cursor position when user clicks in the code area
  const handleCodeClick = (e: React.MouseEvent<HTMLDivElement>, lineIndex: number, charIndex: number) => {
    if (!isActive || isPaused) return;
    
    e.preventDefault();
    
    // Get current text lines
    const lines = typedText.split('\n');
    
    // Ensure we have enough lines
    while (lines.length <= lineIndex) {
      lines.push('');
    }
    
    // Ensure the target line is long enough for the cursor
    const targetLine = lines[lineIndex];
    const codeLines = codeText.split('\n');
    const codeLine = codeLines[lineIndex] || '';
    
    // Only allow positioning within the length of the code or typed text (whichever is longer)
    const maxCharIndex = Math.max(targetLine.length, charIndex);
    
    // Update cursor position
    setCursorPosition({
      line: lineIndex,
      char: Math.min(maxCharIndex, charIndex)
    });
    
    // Update focus line
    setFocusLine(lineIndex);
    
    // Now update the textarea selection and focus
    if (inputRef.current) {
      // Calculate the position in the textarea
      let position = 0;
      for (let i = 0; i < lineIndex; i++) {
        position += lines[i].length + 1; // +1 for the newline character
      }
      position += Math.min(maxCharIndex, charIndex);
      
      inputRef.current.focus();
      inputRef.current.setSelectionRange(position, position);
      
      // If we're clicking beyond the current text, we need to add spaces
      if (charIndex > targetLine.length) {
        const spacesToAdd = charIndex - targetLine.length;
        const newLine = targetLine + ' '.repeat(spacesToAdd);
        lines[lineIndex] = newLine;
        setTypedText(lines.join('\n'));
        
        // Reposition cursor after state update
        setTimeout(() => {
          if (inputRef.current) {
            const newPosition = position + (charIndex - targetLine.length);
            inputRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    onComplete(typedText);
  };

  const handleTimerTick = (remainingTime: number) => {
    if (!isPaused) {
      const elapsed = CHALLENGE_DURATION - remainingTime + savedTimeElapsed;
      setTimeElapsed(elapsed);
    } else {
      // When paused, save the current elapsed time
      setSavedTimeElapsed(timeElapsed);
    }
  };

  // Handle textarea input change with manual cursor positioning
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive || isPaused) return;
    
    const newValue = e.target.value;
    setTypedText(newValue);
    
    // The cursor position will be updated by the effect that monitors typedText
    // We need to store where the cursor is in the textarea for proper click positioning
    if (inputRef.current) {
      const selectionStart = inputRef.current.selectionStart || 0;
      const textBeforeCursor = newValue.substring(0, selectionStart);
      const lines = textBeforeCursor.split('\n');
      const currentLineIndex = lines.length - 1;
      const currentCharIndex = lines[currentLineIndex]?.length || 0;
      
      // Update cursor position manually if needed
      setCursorPosition({
        line: currentLineIndex,
        char: currentCharIndex
      });
      setFocusLine(currentLineIndex);
    }
  };

  // Render code with highlighting based on user input
  const renderCode = () => {
    const codeLines = codeText.split('\n');
    const typedLines = typedText.split('\n');

    return codeLines.map((line, lineIndex) => {
      const chars = line.split('');
      const typedLine = typedLines[lineIndex] || '';
      
      const isCurrentLine = lineIndex === cursorPosition.line;
      
      return (
        <div 
          key={lineIndex} 
          className={`flex ${isCurrentLine ? 'bg-secondary/30' : ''}`}
          onClick={(e) => {
            // Calculate which character was clicked based on mouse position
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            // Estimate character width (adjust as needed)
            const charWidth = 8; // approximate character width in pixels
            const clickedCharIndex = Math.floor(x / charWidth) - 6; // adjust for padding and line numbers
            
            handleCodeClick(e, lineIndex, Math.max(0, clickedCharIndex));
          }}
        >
          <div className="text-muted-foreground w-12 text-right pr-2 select-none font-mono">
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
                }
              }
              
              // Replace spaces with visible spaces
              const displayChar = char === ' ' ? ' ' : char;
              
              return (
                <span 
                  key={charIndex} 
                  className={className}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent div click handler
                    handleCodeClick(e, lineIndex, charIndex);
                  }}
                >
                  {displayChar}
                  {/* Show blinking cursor at current position */}
                  {isCurrentLine && charIndex === cursorPosition.char && (
                    <span className="code-cursor"></span>
                  )}
                </span>
              );
            })}
            
            {/* Show cursor at the end of line if needed */}
            {isCurrentLine && chars.length === cursorPosition.char && (
              <span className="code-cursor"></span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3 bg-secondary/20 p-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleBackClick} 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      
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
        <ScrollArea className="h-[500px]">
          <div 
            className="p-6 rounded-lg font-mono text-sm cursor-text"
            style={{ backgroundColor: 'hsl(var(--code))', color: 'hsl(var(--code-text))' }}
            ref={codeBlockRef}
          >
            <div className="code-block flex flex-col">
              {renderCode()}
            </div>
          </div>
        </ScrollArea>
        
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={!isActive || isPaused}
          className="code-input"
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Tips: Click anywhere in the code to position your cursor. Press Tab to insert 2 spaces. Type exactly as shown including all symbols and whitespace.</p>
      </div>
    </div>
  );
};

export default TypingChallenge;
