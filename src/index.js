import 'babel-polyfill';

const regexps = {
  IP: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/,
  CIDR: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\/(?:(3[0-2]|[1-2][0-9]|[0-9]))$/,
  range: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])-(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/,
};
const toValue = ip => ip.split('.').map(num => Number(num).toString(2).padStart(8, '0')).join('');
const toBinaryString = value => (value >>> 0).toString(2).padStart(32, '0');
const toMaskValue = subnet => {
  switch (subnet) {
    case 0:
      return '00000000000000000000000000000000';
    case 32:
      return '11111111111111111111111111111111';
    default:
      return [].map
        .call((~(~0 << (32 - parseInt(subnet)))).toString(2).padStart(32, '0'), val => (val === '1' ? '0' : '1'))
        .join('');
  }
};
const generateRange = (initialValue, finalValue) => {
  const range = [finalValue];

  while (range[0] > initialValue) {
    range.unshift(range[0] - 1);
  }

  return range;
};
const binaryStringToIPv4 = binaryString =>
  [
    parseInt(binaryString.slice(0, 8), 2),
    parseInt(binaryString.slice(8, 16), 2),
    parseInt(binaryString.slice(16, 24), 2),
    parseInt(binaryString.slice(24, 32), 2),
  ].join('.');

export default function(input, { quiet = true } = {}) {
  const normalizedInput = input.map(line => line.trim()).filter(line => line !== '');

  // Parse all inputs into ranges
  const asRanges = normalizedInput.map(line => {
    // single IP
    if (regexps.IP.test(line)) {
      return [parseInt(toValue(line), 2)];
    }

    // IP range
    if (regexps.range.test(line)) {
      const [initialValue, finalValue] = line.split('-').map(address => toValue(address));

      return generateRange(parseInt(initialValue, 2), parseInt(finalValue, 2));
    }

    // CIDR range
    if (regexps.CIDR.test(line)) {
      const [ip, subnet] = line.split('/');
      const mask = toMaskValue(parseInt(subnet));
      const initialValue = parseInt(toValue(ip), 2) & parseInt(mask, 2);
      const size = 2 ** (32 - parseInt(subnet));
      const finalValue = initialValue + size - 1;

      return generateRange(initialValue, finalValue);
    }

    !quiet && console.error(`Unrecognised input: ${line}`);
    return undefined;
  });

  // Merge all ranges and remove overlapping entries
  const mergedRanges = asRanges
    .reduce((acc, current) => (current !== undefined ? [...acc, ...current] : acc), [])
    .sort((a, b) => a - b)
    .filter((val, i, arr) => arr.indexOf(val) === i);

  // Split again to avoid false detection on non-contiguous ranges
  const splitRanges = mergedRanges.reduce((acc, current) => {
    if (acc[0] !== undefined && acc[0][0] === current - 1) {
      acc[0].unshift(current);
      return acc;
    }

    acc.unshift([current]);
    return acc;
  }, []);

  // look for contained suitable statrts and check if their respective end also exists
  const collapsedRanges = splitRanges
    .map(range => {
      const rangeAsBinary = range.map(value => toBinaryString(value));
      const ranges = [];
      let bits = 32;

      do {
        if (range.length < 2 ** bits) continue;
        const startSuffix = bits > 0 ? '00000000000000000000000000000000'.slice(-bits) : '';
        const endSuffix = bits > 0 ? '11111111111111111111111111111111'.slice(-bits) : '';
        const validStarts = rangeAsBinary.filter(
          (binaryString, _, range) =>
            binaryString.endsWith(startSuffix) &&
            !ranges.some(foundRange => foundRange.start <= binaryString && binaryString <= foundRange.end) &&
            (bits === 0 || range.includes(binaryString.slice(0, -bits) + endSuffix)),
        );

        ranges.unshift(
          ...validStarts.map(start => ({
            start,
            end: `${bits > 0 ? start.slice(0, -bits) : start}${endSuffix}`,
            subnet: `${32 - bits}`,
          })),
        );
      } while (bits--);

      return ranges;
    })
    .reduce((acc, current) => (current !== undefined ? [...acc, ...current] : acc), [])
    .sort((a, b) => (a.start > b.start ? 1 : a.start < b.start ? -1 : 0))
    .map(({ start, subnet }) => `${binaryStringToIPv4(start)}/${subnet}`);

  return collapsedRanges;
}
