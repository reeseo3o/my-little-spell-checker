export const htmlToString = (rawStr: string) => {
  let msg = rawStr
    .replace(/<br\/>/g, '\n')
    .replace("도움말 정보 없음", "");
  msg = msg.replace(/^\s*$(?:\r\n?|\n)/gm, "");
  return msg;
}; 