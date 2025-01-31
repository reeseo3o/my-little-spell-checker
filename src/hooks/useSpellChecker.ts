import { useState } from 'react';
import { ErrInfo } from '@/types/speller';

export const useSpellChecker = () => {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<ErrInfo[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkSpelling = async (textToCheck: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/spell-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToCheck }),
      });
      
      const data = await response.json();
      setErrors(data.errors);
    } catch (error) {
      console.error('Error checking spelling:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async (newText: string) => {
    if (isChecked) {
      setText('');
      setErrors([]);
      setIsChecked(false);
    } else {
      setText(newText);
      await checkSpelling(newText);
      setIsChecked(true);
    }
  };

  const handleTextChange = (newText: string) => {
    if (!isChecked) {
      setText(newText);
    }
  };

  return {
    text,
    errors,
    isChecked,
    isLoading,
    handleCheck,
    handleTextChange
  };
};