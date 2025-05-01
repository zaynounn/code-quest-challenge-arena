
export const calculateAccuracy = (
  originalText: string,
  typedText: string
): number => {
  // if nothing has been typed yet, return 0
  if (typedText.length === 0) return 0;
  
  // Only compare up to the length of the typed text
  const relevantOriginal = originalText.substring(0, typedText.length);
  
  let correctChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (i < relevantOriginal.length && typedText[i] === relevantOriginal[i]) {
      correctChars++;
    }
  }
  
  return Math.floor((correctChars / typedText.length) * 100);
};

export const calculateWPM = (
  originalText: string,
  typedText: string,
  timeInSeconds: number
): number => {
  // Standard word length for WPM calculation
  const avgWordLength = 5;
  
  // If no time has passed or nothing typed, return 0
  if (timeInSeconds === 0 || typedText.length === 0) return 0;
  
  // Calculate characters per minute
  const minutes = timeInSeconds / 60;
  const charCount = typedText.length;
  const charsPerMinute = charCount / minutes;
  
  // Convert to words per minute
  return Math.floor(charsPerMinute / avgWordLength);
};

// Phone number validation functions
export const validateUSPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phoneNumber);
};

export const validateLebanesePhoneNumber = (phoneNumber: string): boolean => {
  // Lebanese phone numbers typically start with +961 followed by 8 digits
  // or 03/70/71/etc. followed by 6 digits
  const phoneRegex = /^(\+961|0)([1-9])(\d{6,7})$/;
  return phoneRegex.test(phoneNumber);
};

