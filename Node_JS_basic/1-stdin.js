// process.stdout.write() prints the text withouth \n
process.stdout.write('Welcome to Holberton School, what is your name?\n');
// process.stdin launches the event data
// In interactive mode: When user press Enter
// In pipe mode: Whit the pipe
process.stdin.on('data', (data) => {
  // .toString() transform data to string and .trim() avoids the \n of Enter
  process.stdout.write(`Your name is: ${data.toString().trim()}\n`);
});
// The event close launches when the stdin is closed (end of pipe or Ctrl+D)
process.stdin.on('close', () => {
  process.stdout.write('This important software is now closing\n');
});
