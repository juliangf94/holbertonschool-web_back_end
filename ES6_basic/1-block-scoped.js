export default function taskBlock(trueOrFalse) {
  const task = false;
  const task2 = true;

  if (trueOrFalse) {
    // block scope: inner const declarations don't affect outer const
  }

  return [task, task2];
}
