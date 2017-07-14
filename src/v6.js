import { v6 as regexps } from './regexps';

export function expandAddress(address) {
  let colonsNumber = address.match(/:/g);
  let colonsToInsert = '::';
  if (colonsNumber < 7) {
    do {
      colonsToInsert += ':';
    } while (7 - colonsNumber++);
    address.replace('::', colonsToInsert);
  }
  return address;
}

export function toSegments(address) {
  return address.toLowerCase().split(':').map(segment => segment.padStart(4, '0'));
}

export function generateRange(initialValue, finalValue) {
  return [initialValue, finalValue];
}

export function convertToRanges(normalizedInput) {
  return normalizedInput
    .map(line => expandAddress(line))
    .map(line => {
      // single IP
      if (regexps.IP.test(line)) {
        return [new Uint16Array(toSegments(line).map(segment => parseInt(segment, 16)))];
      }

      // IP range
      if (regexps.range.test(line)) {
        const [initialValue, finalValue] = line
          .split('-')
          .map(address => new Uint16Array(toSegments(address).map(segment => parseInt(segment, 16))));

        return [initialValue, finalValue];
      }

      // CIDR range
      // if (regexps.CIDR.test(line)) {
      //   const [ip, subnet] = line.split('/');
      //   const mask = toMaskValue(parseInt(subnet));
      //   const initialValue = toSegments(ip);
      //   const size = 2 ** (128 - parseInt(subnet));
      //   const finalValue = initialValue + size - 1;

      //   return generateRange(initialValue, finalValue);
      // }

      return undefined;
    })
    .filter(range => range !== undefined && range.length > 0);
}

export function collapseRanges(ranges) {
  return ranges;
}
