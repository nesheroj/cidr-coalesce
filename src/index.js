import 'babel-polyfill';
import * as v4 from './v4';
import * as v6 from './v6';

export default function(input, { quiet = true } = {}) {
  const normalizedInput = input.map(line => line.trim()).filter(line => line !== '');

  return [
    ...v4.collapseRanges(v4.convertToRanges(normalizedInput)),
    ...v6.collapseRanges(v6.convertToRanges(normalizedInput)),
  ];
}
