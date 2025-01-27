export interface SpellerResponse {
  str: string;
  errInfo: ErrInfo[];
  idx: number;
}

export interface ErrInfo {
    help: string;
    start: number;
    end: number;
    orgStr: string;
    candWord: string;
}