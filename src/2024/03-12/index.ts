import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function solvePart1(input: string) {
  let result = 0;

  for (const mul of input.matchAll(/(mul\(\d+,\d+\))/g)) {
    const nums = mul[0].replace(/mul\(/, '').replace(')', '');
    const [a, b] = nums.split(',');
    result += Number(a) * Number(b);
  }

  return result;
}

function solvePart2(input: string) {
  let result = 0;
  let enabled = true;

  for (const mul of input.matchAll(/(mul\(\d+,\d+\))|don't\(\)|do\(\)/g)) {
    if (mul[0] === "don't()") {
      enabled = false;
    } else if (mul[0] === 'do()') {
      enabled = true;
    } else if (enabled) {
      const nums = mul[0].replace(/mul\(/, '').replace(')', '');
      const [a, b] = nums.split(',');
      result += Number(a) * Number(b);
    }
  }

  return result;
}

export async function main() {
  const input = await readFile(inputPath);
  const { val: part1, time: time1 } = executeWithTiming(solvePart1, input);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, input);

  return {
    part1,
    part2,
    time1,
    time2,
  };
}
