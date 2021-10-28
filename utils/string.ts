export const capitalize = (str: string): string =>
  // \s matches to whitespace character
  // \S matches a non-whitespace character
  // (x|y) matches to either x or y
  str.replace(/(^|\s)\S/g, l => l.toUpperCase());
