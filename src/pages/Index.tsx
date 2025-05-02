
import React, { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import TypingChallenge from '@/components/TypingChallenge';
import ResultsDisplay from '@/components/ResultsDisplay';
import { UserData, codingChallenge } from '@/utils/challengeData';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { KeyboardIcon, AwardIcon, UserIcon } from 'lucide-react';

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

  const handleBack = () => {
    setChallengeState(ChallengeState.REGISTRATION);
  };

  const renderStepIndicator = () => {
    const steps = [
      { icon: <UserIcon className="h-5 w-5" />, label: "Register", active: challengeState === ChallengeState.REGISTRATION },
      { icon: <KeyboardIcon className="h-5 w-5" />, label: "Type", active: challengeState === ChallengeState.TYPING },
      { icon: <AwardIcon className="h-5 w-5" />, label: "Results", active: challengeState === ChallengeState.RESULTS }
    ];

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.label}>
              <div className={`flex flex-col items-center ${step.active ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step.active ? 'border-primary bg-primary/20' : 'border-muted'}`}>
                  {step.icon}
                </div>
                <span className="mt-1 text-xs">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-1 ${index < challengeState ? 'bg-primary' : 'bg-muted'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (challengeState) {
      case ChallengeState.REGISTRATION:
        return (
          <Card className="bg-secondary/10 backdrop-blur-sm border border-secondary/30 animate-fade-in">
            <CardContent className="pt-6">
              <RegistrationForm onRegister={handleRegister} />
            </CardContent>
          </Card>
        );
      case ChallengeState.TYPING:
        return <TypingChallenge 
                 codeText={codingChallenge} 
                 onComplete={handleChallengeComplete} 
                 onBack={handleBack}
               />;
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
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-br from-background to-secondary/30 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
          Code Quest Challenge Arena
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          Test your coding speed and accuracy with our 3-minute typing challenge.
        </p>
        {challengeState === ChallengeState.TYPING && userData && (
          <p className="mt-2 text-sm text-muted-foreground">
            Good luck, <span className="text-primary font-medium">{userData.name}</span>! Time to show your typing skills.
          </p>
        )}
      </div>
      
      {renderStepIndicator()}
      
      <div className="w-full max-w-4xl mb-12">
        {renderContent()}
      </div>
      
      <div className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
          <div className="feature bg-secondary/10 p-3 rounded-lg backdrop-blur-sm hover:bg-secondary/20 transition-all">
            <h3 className="text-primary font-medium">Improves Accuracy</h3>
            <p className="text-xs">Practice makes perfect. Regular typing practice enhances precision.</p>
          </div>
          <div className="feature bg-secondary/10 p-3 rounded-lg backdrop-blur-sm hover:bg-secondary/20 transition-all">
            <h3 className="text-primary font-medium">Boosts Speed</h3>
            <p className="text-xs">Challenge yourself to type faster with each attempt.</p>
          </div>
          <div className="feature bg-secondary/10 p-3 rounded-lg backdrop-blur-sm hover:bg-secondary/20 transition-all">
            <h3 className="text-primary font-medium">Tracks Progress</h3>
            <p className="text-xs">Review detailed stats to see your improvement over time.</p>
          </div>
        </div>
        <p>© 2025 Code Quest Challenge Arena. All rights reserved.</p>
        <p className="mt-1">Your data is securely stored and never shared with third parties.</p>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
