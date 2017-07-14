import * as regexps from './regexps';

describe('IPv4', () => {
  test('Matches a single address', () => {
    expect(regexps.v4.IP.test('192.168.1.1')).toEqual(true);
  });
  test('Doesn`t match invalid input', () => {
    expect(regexps.v4.IP.test('foobar')).toEqual(false);
  });
  test('Doesn`t match a single address out of range', () => {
    expect(regexps.v4.IP.test('300.300.1.1')).toEqual(false);
  });
  test('Matches an address start-end range', () => {
    expect(regexps.v4.range.test('192.168.1.1-192.169.3.50')).toEqual(true);
  });
  test('Matches an address CIDR range', () => {
    expect(regexps.v4.CIDR.test('192.168.1.1/23')).toEqual(true);
  });
  test('Doesn`t match a CIDR subnet out of range', () => {
    expect(regexps.v4.CIDR.test('192.168.1.1/64')).toEqual(false);
  });
});

describe('IPv6', () => {
  test('Matches a single address', () => {
    expect(regexps.v6.IP.test('1234:5678:90ab:cdef:1234:5678:90ab:cdef')).toEqual(true);
  });
  test('Doesn`t match invalid input', () => {
    expect(regexps.v6.IP.test('foobar')).toEqual(false);
  });
  test('Doesn`t match a single address out of range', () => {
    expect(regexps.v6.IP.test('zzz:zzzz:zzzz:zzzz:zzzz:zzzz:zzzz:zzzz')).toEqual(false);
  });
  test('Matches an address start-end range', () => {
    expect(
      regexps.v6.range.test('1234:5678:90ab:cdef:1234:5678:90ab:cdef-1234:5678:90ab:cdef:1234:5678:90ab:cdff'),
    ).toEqual(true);
  });
  test('Matches an address CIDR range', () => {
    expect(regexps.v6.CIDR.test('1234:5678:90ab:cdef:1234:5678:90ab:cdef/23')).toEqual(true);
  });
  test('Doesn`t match a CIDR subnet out of range', () => {
    expect(regexps.v6.CIDR.test('1234:5678:90ab:cdef:1234:5678:90ab:cdef/300')).toEqual(false);
  });
});
