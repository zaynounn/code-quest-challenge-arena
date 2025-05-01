
import React, { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import TypingChallenge from '@/components/TypingChallenge';
import ResultsDisplay from '@/components/ResultsDisplay';
import { UserData, codingChallenge } from '@/utils/challengeData';
import { Toaster } from '@/components/ui/toaster';

enum ChallengeState {
  REGISTRATION,
  TYPING,
  RESULTS
}

const Index = () => {
  const [challengeState, setChallengeState] = useState<ChallengeState>(ChallengeState.REGISTRATION);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [typedText, setTypedText] = useState('');

  const handleRegister = (data: UserData) => {
    setUserData(data);
    setChallengeState(ChallengeState.TYPING);
  };

  const handleChallengeComplete = (text: string) => {
    setTypedText(text);
    setChallengeState(ChallengeState.RESULTS);
  };

  const handleRestart = () => {
    setChallengeState(ChallengeState.TYPING);
    setTypedText('');
  };

  const renderContent = () => {
    switch (challengeState) {
      case ChallengeState.REGISTRATION:
        return <RegistrationForm onRegister={handleRegister} />;
      case ChallengeState.TYPING:
        return <TypingChallenge codeText={codingChallenge} onComplete={handleChallengeComplete} />;
      case ChallengeState.RESULTS:
        return (
          <ResultsDisplay
            originalText={codingChallenge}
            typedText={typedText}
            userName={userData?.name || 'User'}
            onRestart={handleRestart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-br from-background to-secondary/30">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
          Code Quest Challenge Arena
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Test your coding speed and accuracy with our 3-minute typing challenge.
          {challengeState === ChallengeState.REGISTRATION && " Register to begin!"}
        </p>
      </div>
      
      {renderContent()}
      
      <footer className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Code Quest Challenge Arena. All rights reserved.</p>
        <p className="mt-1">Your data is securely stored and never shared with third parties.</p>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
