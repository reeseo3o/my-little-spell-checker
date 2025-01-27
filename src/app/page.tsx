"use client"

import { useState } from "react";
import Results from "./components/Results";
import TextArea from "./components/TextArea";
import { ErrInfo } from "@/types/speller";

export default function Home() {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<ErrInfo[]>([]);

  const handleCheck = async (newText: string) => {
    setText(newText);
    await checkSpelling(newText);
  };

  const checkSpelling = async (textToCheck: string) => {
    try {
      const response = await fetch('/api/spell-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToCheck }),
      });
      
      const data = await response.json();
      setErrors(data.errors);
      
      // 모든 맞춤법 오류를 수정한 텍스트 생성
      let correctedText = textToCheck;
      // 순서대로 수정
      for (const error of data.errors) {
        correctedText = 
          correctedText.slice(0, error.start) + 
          error.candWord + 
          correctedText.slice(error.end);
      }
    } catch (error) {
      console.error('Error checking spelling:', error);
    }
  };

  const handleFix = (start: number, end: number, newText: string) => {
    const beforeText = text.slice(0, start);
    const afterText = text.slice(end);
    const updatedText = beforeText + newText + afterText;
    setText(updatedText);
    
    // 현재 에러에서 수정된 에러 제거
    const updatedErrors = errors.filter(error => 
      error.start !== start || error.end !== end
    );
    setErrors(updatedErrors);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">한글 맞춤법 검사기</h1>
      <div className="w-full flex flex-col items-center gap-8">
        <TextArea 
          text={text}
          onTextChange={setText}
          onCheck={handleCheck}
        />
        <Results 
          errors={errors}
          originalText={text}
          onFix={handleFix}
        />
      </div>
      <div className="text-sm text-gray-500">
        Powered by PNU Korean Spell Checker
      </div>
    </div>
  );
}