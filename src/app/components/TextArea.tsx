'use client';

interface TextAreaProps {
  text: string;
  onTextChange: (text: string) => void;
  onCheck: (text: string) => void;
  isReadOnly: boolean;
}

export default function TextArea({ text, onTextChange, onCheck, isReadOnly }: TextAreaProps) {
  const maxLength = 5000; // 최대 글자수 제한
  const isTextEmpty = text.trim().length === 0;
  const isTextTooLong = text.length > maxLength;
  const isButtonDisabled = !isReadOnly && (isTextEmpty || isTextTooLong);

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <div className="relative">
        <textarea
          className={`w-full h-48 p-4 border rounded-lg resize-none bg-background text-foreground 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${isReadOnly ? 'cursor-not-allowed opacity-75' : ''}
            ${isTextTooLong ? 'border-red-500' : ''}`}
          placeholder="맞춤법을 검사할 텍스트를 입력하세요..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
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
        onClick={() => {
          if (isReadOnly) {
            onTextChange("");
            onCheck("");
          } else {
            onCheck(text);
          }
        }}
        disabled={isButtonDisabled}
        className={`px-4 py-2 rounded-lg transition-colors cursor-pointer
          ${isButtonDisabled 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
      >
        {isReadOnly ? "새로 검사하기" : "검사하기"}
      </button>
    </div>
  );
} 