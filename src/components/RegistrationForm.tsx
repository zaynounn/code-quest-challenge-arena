
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserData } from '@/utils/challengeData';
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { validateUSPhoneNumber, validateLebanesePhoneNumber } from '@/utils/typingUtils';

interface RegistrationFormProps {
  onRegister: (userData: UserData) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLebanese, setIsLebanese] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate name
    if (name.trim() === '') {
      setNameError('Please enter your name');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate phone number based on selected type
    if (phoneNumber.trim() === '') {
      setPhoneError('Please enter your phone number');
      isValid = false;
    } else if (isLebanese) {
      // Lebanese phone validation
      if (!validateLebanesePhoneNumber(phoneNumber)) {
        setPhoneError('Please enter a valid Lebanese phone number (e.g., +9611234567 or 03123456)');
        isValid = false;
      } else {
        setPhoneError('');
      }
    } else {
      // US phone validation
      if (!validateUSPhoneNumber(phoneNumber)) {
        setPhoneError('Please enter a valid US phone number');
        isValid = false;
      } else {
        setPhoneError('');
      }
    }
    
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onRegister({ 
        name, 
        phoneNumber,
        phoneType: isLebanese ? 'Lebanese' : 'US'
      });
      toast({
        title: "Registration successful!",
        description: "Get ready for the coding challenge!",
      });
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    if (isLebanese) {
      // For Lebanese numbers, we just take the input as is
      setPhoneNumber(input);
    } else {
      // For US numbers, we format it
      const numericInput = input.replace(/\D/g, '').substring(0, 10);
      const formattedNumber = formatUSPhoneNumber(numericInput);
      setPhoneNumber(formattedNumber);
    }
  };

  const formatUSPhoneNumber = (input: string): string => {
    if (input.length <= 3) {
      return input;
    } else if (input.length <= 6) {
      return `(${input.slice(0, 3)}) ${input.slice(3)}`;
    } else {
      return `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
    }
  };

  const handleToggleChange = () => {
    setIsLebanese(!isLebanese);
    setPhoneNumber(''); // Clear phone number when switching formats
    setPhoneError('');  // Clear errors
  };

  return (
    <div className="w-full max-w-md p-6 bg-secondary/50 rounded-lg shadow-lg backdrop-blur-sm border border-secondary">
      <h2 className="text-2xl font-bold text-center mb-6">Join the Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={`w-full ${nameError ? 'border-red-500' : ''}`}
          />
          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-xs">US</span>
              <Switch 
                checked={isLebanese} 
                onCheckedChange={handleToggleChange} 
                aria-label="Toggle phone number format"
              />
              <span className="text-xs">Lebanese</span>
            </div>
          </div>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={isLebanese ? "+9611234567 or 03123456" : "(123) 456-7890"}
            className={`w-full ${phoneError ? 'border-red-500' : ''}`}
          />
          {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
          <p className="text-xs text-gray-400 mt-1">
            Your information is securely stored and will not be shared.
          </p>
        </div>
        
        <Button type="submit" className="w-full">
          Start Challenge
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
