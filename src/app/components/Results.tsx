 'use client';

import { ErrInfo } from '@/types/speller';
import { htmlToString } from '@/utils/html';

interface ResultsProps {
  errors: ErrInfo[];
  originalText: string;
}

export default function Results({ errors, originalText }: ResultsProps) {
  if (!errors || errors.length === 0) return null;

  const renderText = () => {
    const result = [];
    let lastIndex = 0;

    errors.forEach((error) => {
      result.push(originalText.slice(lastIndex, error.start));
      result.push(
        <span key={error.start} className="bg-green-200 dark:bg-green-900 px-1 rounded">
          {error.candWord}
        </span>
      );
      lastIndex = error.end;
    });

    result.push(originalText.slice(lastIndex));
    return result;
  };

  const handleCopy = async () => {
    try {
      let correctedText = originalText;
      errors.forEach((error) => {
        correctedText = 
          correctedText.slice(0, error.start) + 
          error.candWord + 
          correctedText.slice(error.end);
      });
      
      await navigator.clipboard.writeText(correctedText);
      alert('수정된 텍스트가 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">수정된 텍스트</h2>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
          >
            클립보드에 복사
          </button>
        </div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}