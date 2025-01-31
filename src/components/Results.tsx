'use client';

import { ErrInfo } from '@/types/speller';
import { getCorrectedText, htmlToString } from '../utils/common';
import { Toast } from './Toast';
import { useState } from 'react';

interface ResultsProps {
  errors: ErrInfo[] | null;
  originalText: string;
  isChecked: boolean;
}

export default function Results({ errors, originalText, isChecked }: ResultsProps) {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  if (!errors || !isChecked) return null;

  if (errors.length === 0) {
    return (
      <div className="w-full max-w-2xl">
        <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
          <p className="text-center font-medium">
            맞춤법이 정확합니다! 👏
          </p>
        </div>
      </div>
    );
  }

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
      const correctedText = getCorrectedText(originalText, errors);
      await navigator.clipboard.writeText(correctedText);
      setToastMessage('수정된 텍스트가 클립보드에 복사되었습니다.');
      setToastType('success');
      setToastOpen(true);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      setToastMessage('클립보드 복사에 실패했습니다.');
      setToastType('error');
      setToastOpen(true);
    }
  };

  return (
    <>
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

      <Toast.Root 
        open={toastOpen} 
        onOpenChange={setToastOpen}
        duration={3000}
      >
        <Toast.Title>
          {toastType === 'success' ? '성공' : '실패'}
        </Toast.Title>
        <Toast.Description>
          {toastMessage}
        </Toast.Description>
      </Toast.Root>
    </>
  );
}