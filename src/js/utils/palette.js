import chroma from 'chroma-js';
export default (base = [], amount = 5) => {
  if (!Array.isArray(base)) throw new Error('Base colors should be an array');
  if (base.length < 2) throw new Error('At least 2 base colors are required to generate a palette');

  return chroma
    .scale(base)
    .colors(amount)
    .map((color) => Number(`0x${color.substr(1)}`));
};
