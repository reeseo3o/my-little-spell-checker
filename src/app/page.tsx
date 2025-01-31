"use client";

import TextArea from "@/components/TextArea";
import Results from "../components/Results";
import { useSpellChecker } from "@/hooks/useSpellChecker";

export default function Home() {
  const { text, errors, isChecked, handleCheck, handleTextChange } =
    useSpellChecker();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">한국어 맞춤법 검사기</h1>
      <div className="w-full flex flex-col items-center gap-8 py-8">
        <TextArea
          text={text}
          onTextChange={handleTextChange}
          onCheck={handleCheck}
          isReadOnly={isChecked}
        />
        <Results errors={errors} originalText={text} isChecked={isChecked} />
      </div>
      <div className="text-sm text-gray-500">
        Powered by PNU Korean Spell Checker
      </div>
    </div>
  );
}
