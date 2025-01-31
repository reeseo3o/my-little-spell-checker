'use client';

import { sanitizeText } from '@/utils/common';
import { useEffect, useRef, useState } from 'react';

interface TextAreaProps {
  text: string;
  onTextChange: (text: string) => void;
  onCheck: (text: string) => void;
  isReadOnly: boolean;
}

export default function TextArea({ text, onTextChange, onCheck, isReadOnly }: TextAreaProps) {
  const maxLength = 5000; 
  const isTextEmpty = text.trim().length === 0;
  const isTextTooLong = text.length > maxLength;
  const isButtonDisabled = !isReadOnly && (isTextEmpty || isTextTooLong);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 700); 
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleCheck = async () => {
    if (isReadOnly) {
      onTextChange("");
      onCheck("");
    } else {
      setIsLoading(true);
      await onCheck(text);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="relative transition-all duration-300 ease-in-out">
        <textarea
          ref={textareaRef}
          className={`w-full min-h-[12rem] max-h-[700px] p-4 border rounded-lg resize-none bg-background text-foreground 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-y-auto
            transition-all duration-300 ease-in-out transform
            ${isReadOnly ? 'cursor-not-allowed opacity-75 scale-99' : 'scale-100'}
            ${isTextTooLong ? 'border-red-500' : ''}`}
          placeholder="맞춤법을 검사할 텍스트를 입력하세요."
          value={text}
          onChange={(e) => {
            const sanitizedText = sanitizeText(e.target.value);
            onTextChange(sanitizedText);
          }}
          readOnly={isReadOnly}
          maxLength={maxLength}
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {text.length} / {maxLength}
        </div>
      </div>
      
      {isTextTooLong && (
        <p className="text-red-500 text-sm">
          텍스트가 너무 깁니다. {maxLength}자 이하로 입력해주세요.
        </p>
      )}
      
      <button
        onClick={handleCheck}
        disabled={isButtonDisabled || isLoading}
        className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform
          ${isButtonDisabled || isLoading
            ? 'bg-gray-300 cursor-not-allowed opacity-75 scale-[0.99]'
            : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-[0.99]'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            검사중...
          </span>
        ) : (
          isReadOnly ? "새로 검사하기" : "검사하기"
        )}
      </button>
    </div>
  );
} 