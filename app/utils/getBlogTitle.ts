export default function getBlogTitle(text: string) {
  const titleReg = /^#\s(.*)(\r\n|\r|\n)/;

  return text.match(titleReg)?.[1];
}
