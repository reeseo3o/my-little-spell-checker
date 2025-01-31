import { ErrInfo } from '@/types/speller';

export const getCorrectedText = (originalText: string, errors: ErrInfo[]): string => {
    let correctedText = originalText;
    errors.forEach((error) => {
      correctedText = 
        correctedText.slice(0, error.start) + 
        error.candWord + 
        correctedText.slice(error.end);
    });
    return correctedText;
  };


  export const htmlToString = (rawStr: string) => {
    let msg = rawStr
      .replace(/<br\/>/g, '\n')
      .replace("도움말 정보 없음", "");
    msg = msg.replace(/^\s*$(?:\r\n?|\n)/gm, "");
    return msg;
  }; 

export const sanitizeText = (text: string): string => {
    return text
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 제어 문자 제거
      .replace(/\u200B/g, '') // 제로 너비 공백 제거
      .replace(/[\uFFFD\uFFFE\uFFFF]/g, '') // 유효하지 않은 유니코드 제거
      .replace(/\r\n|\r|\n/g, '\n'); // 줄바꿈 문자 정규화
  };