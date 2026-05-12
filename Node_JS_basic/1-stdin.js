const readline = require('readline');

process.stdout.write('Welcome to Holberton School, what is your name?\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('line', (name) => {
  process.stdout.write(`Your name is: ${name}\n`);
});

rl.on('close', () => {
  process.stdout.write('This important software is now closing\n');
});
