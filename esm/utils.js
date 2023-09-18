const truncateString = (codeValue, codeLength) => {
  const newArray =  codeValue.substr(0, codeLength).split('');
  return newArray.length ? newArray.map((item) => {
    if (item != ' ') return item
    return ''
  }) : newArray;
}
const emptySymbols = (codeLength) => new Array(codeLength).fill('');
export const getSymbols = (codeValue, codeLength) => 
  new Array()
    .concat(truncateString(codeValue, codeLength))
    .concat(emptySymbols(codeLength))
    .slice(0, codeLength);
export const getStyle = (base, custom) => (custom ? [base, custom] : base);
export const isLastFilledCell = ({value, index}) =>
  Boolean(value && value.length - 2 === index);
