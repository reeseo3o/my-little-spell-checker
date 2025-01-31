"use client"

import TextArea from "@/components/TextArea";
import Results from "../components/Results";
import { useSpellChecker } from "@/hooks/useSpellChecker";

export default function Home() {
  const { text, errors, isChecked, handleCheck, handleTextChange } = useSpellChecker();

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