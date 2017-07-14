export default [
  {
    description: 'Single IPv4',
    inputs: ['192.168.1.1'],
    expectations: ['192.168.1.1/32'],
  },
  {
    description: 'Single IPv6',
    inputs: ['1234:5678:90ab:cdef:1234:5678:90ab:cdef'],
    expectations: ['192.168.1.1/32'],
  },
  {
    description: 'IPv4 range',
    inputs: ['192.168.1.1-192.168.1.100'],
    expectations: [
      '192.168.1.1/32',
      '192.168.1.2/31',
      '192.168.1.4/30',
      '192.168.1.8/29',
      '192.168.1.16/28',
      '192.168.1.32/27',
      '192.168.1.64/27',
      '192.168.1.96/30',
      '192.168.1.100/32',
    ],
  },
  {
    description: 'IPv4 CIDR',
    inputs: ['192.168.1.1/30'],
    expectations: ['192.168.1.0/30'],
  },
  {
    description: 'Malformed input',
    inputs: ['asdfasdf'],
    expectations: [],
  },
];
