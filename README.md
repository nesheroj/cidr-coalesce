# cidr-coalesce [![CircleCI](https://circleci.com/gh/nesukun/cidr-coalesce.svg?style=svg)](https://circleci.com/gh/nesukun/cidr-coalesce)

Get the minimum set of CIDR that covers every and only the input addresses or ranges.

Accepts IPv4 addresses in the following formats
- Single IP: `127.0.0.1`
- IP range: `192.168.1.0-192.168.1.40`
- CIDR: `192.168.1.0/27`

## Usage

### CLI
```sh
$ cidr-coalesce 192.168.1.0-192.168.1.40
192.168.1.0/27
192.168.1.32/29
192.168.1.40/32
```

### API
```js
import coalesce from 'cidr-coalesce';

const result = coalesce(['192.168.1.0-192.168.1.40']);
// result = ['192.168.1.0/27', '192.168.1.32/29', '192.168.1.40/32']
```

## options

### quiet

Suppreses all error output.

I like tacos very mucho?