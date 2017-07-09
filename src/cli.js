#!/usr/bin/env node
import 'babel-polyfill';
import { EOL } from 'os';
import program from 'commander';
import packageInfo from '../package';
import main from '.';

program
  .version(packageInfo.version)
  .description(
    `Get the minimum set of CIDR that covers every and only the input addresses or ranges.

  Accepts IPv4 addresses in the following formats

  Single IP: 127.0.0.1
  IP range: 192.168.1.0-192.168.1.40
  CIDR: 192.168.1.0/27`,
  )
  .usage('[options] <address or range ...>')
  .option('-q, --quiet', 'Suppress all error output', () => true)
  .parse(process.argv);

const quiet = !!program.quiet;

if (!process.stdin.isTTY) {
  // Piped input
  let stdin = '';
  process.stdin.on('readable', function() {
    const chunk = this.read();
    if (chunk !== null) {
      stdin += chunk;
    }
  });
  process.stdin.on('end', () => {
    const input = [...program.args, ...stdin.split(/\s+/)];
    const result = main(input, { quiet });
    result.length ? console.log(result.join(EOL)) : program.help();
  });
} else {
  // Launched directly
  const result = main(program.args, { quiet });
  result.length ? console.log(result.join(EOL)) : program.help();
}
