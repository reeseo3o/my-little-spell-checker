'use client';

interface TextAreaProps {
  text: string;
  onTextChange: (text: string) => void;
  onCheck: (text: string) => void;
}

export default function TextArea({ text, onTextChange, onCheck }: TextAreaProps) {
  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <textarea
        className="w-full h-48 p-4 border rounded-lg resize-none bg-background text-foreground"
        placeholder="맞춤법을 검사할 텍스트를 입력하세요..."
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      />
      <button
        onClick={() => onCheck(text)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        검사하기
      </button>
    </div>
  );
} 