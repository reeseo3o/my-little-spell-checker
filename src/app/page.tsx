"use client"

import { useState } from "react";
import Results from "./components/Results";
import TextArea from "./components/TextArea";
import { ErrInfo } from "@/types/speller";

export default function Home() {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<ErrInfo[]>([]);
  const [isChecked, setIsChecked] = useState(false);

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

  // const testSpecialCharacters = async () => {
  //   // 유니코드 문자열 테스트 케이스
  //   const testCases = [
  //     '\u1112\u1161\u11ab재는 발표중!',  // '한재는 발표중!'
  //   ];

  //   console.log("=== 유니코드 문자 테스트 시작 ===");
    
  //   for (const testText of testCases) {
  //     console.log("\n원본 텍스트:", testText);
  //     console.log("첫 두 글자:", testText.substring(0, 2));
      
  //     try {
  //       const response = await fetch('/api/spell-checker', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ text: testText }),
  //       });
        
  //       const data = await response.json();
  //       console.log("맞춤법 검사 결과:", data);
  //     } catch (error) {
  //       console.error("에러 발생:", error);
  //     }
  //   }
    
  //   console.log("\n=== 테스트 완료 ===");
  // };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">한글 맞춤법 검사기</h1>
      <div className="w-full flex flex-col items-center gap-8 py-8">
        <TextArea 
          text={text}
          onTextChange={handleTextChange}
          onCheck={handleCheck}
          isReadOnly={isChecked}
        />
        {/* {process.env.NODE_ENV === 'development' && (
          <button
            onClick={testSpecialCharacters}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            자소 분리 테스트
          </button>
        )} */}
        <Results 
          errors={errors}
          originalText={text}
        />
      </div>
      <div className="text-sm text-gray-500">
        Powered by PNU Korean Spell Checker
      </div>
    </div>
  );
}