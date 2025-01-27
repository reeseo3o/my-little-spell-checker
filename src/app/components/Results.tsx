 'use client';

import { ErrInfo } from '@/types/speller';
import { htmlToString } from '@/utils/html';

interface ResultsProps {
  errors: ErrInfo[];
  originalText: string;
  onFix: (start: number, end: number, newText: string) => void;
}

export default function Results({ errors, originalText, onFix }: ResultsProps) {
  if (!errors || errors.length === 0) return null;

  const renderText = () => {
    const result = [];
    let lastIndex = 0;

    errors.forEach((error) => {
      // 현재 에러 이전의 일반 텍스트
      result.push(originalText.slice(lastIndex, error.start));
      
      // 수정된 부분
      result.push(
        <span key={error.start} className="bg-green-200 dark:bg-green-900 px-1 rounded">
          {error.candWord}
        </span>
      );
      
      lastIndex = error.end;
    });

    // 마지막 에러 이후의 텍스트
    result.push(originalText.slice(lastIndex));

    return result;
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">수정된 텍스트</h2>
        <pre className="whitespace-pre-wrap p-4 border rounded-lg bg-background">
          {renderText()}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">검사 결과</h2>
        <div className="space-y-4">
          {errors.map((error, index) => (
            <div key={index} className="p-4 border rounded-lg bg-background">
              <p className="text-red-500">오류: {error.orgStr}</p>
              <p className="text-green-500">제안: {error.candWord}</p>
              <p className="text-sm text-gray-500 mt-2">
                {error.help && htmlToString(error.help)}
              </p>
              <button
                onClick={() => onFix(error.start, error.end, error.candWord)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                수정하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}