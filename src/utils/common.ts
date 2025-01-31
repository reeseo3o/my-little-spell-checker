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