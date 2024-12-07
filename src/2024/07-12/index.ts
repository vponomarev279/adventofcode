import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

type Input = {
  target: number;
  nums: number[];
};

type Operator = '+' | '*' | '||';

function parseInput(input: string) {
  const result: Input[] = [];

  for (const line of input.split('\n').filter((line) => line !== '')) {
    const [a, b] = line.split(': ');
    const nums = b.split(' ').map(Number);

    result.push({
      target: Number(a),
      nums,
    });
  }

  return result;
}

function calc(a: number, b: number, op: Operator) {
  if (op === '+') {
    return a + b;
  }

  if (op === '*') {
    return a * b;
  }

  return +`${a}${b}`;
}

function isValid(nums: number[], target: number, ops: Operator[]): boolean {
  const vals: Set<number> = new Set();

  function backtrack(current: number, index: number) {
    if (index === nums.length) {
      vals.add(current);

      return;
    }

    for (const op of ops) {
      backtrack(calc(current, nums[index], op), index + 1);
    }
  }

  backtrack(nums[0], 1);

  return vals.has(target);
}

function solvePart1(parsed: Input[]) {
  let result = 0;
  for (const { nums, target } of parsed) {
    if (isValid(nums, target, ['+', '*'])) {
      result += target;
    }
  }

  return result;
}

function solvePart2(parsed: Input[]) {
  let result = 0;
  for (const { nums, target } of parsed) {
    if (isValid(nums, target, ['+', '*', '||'])) {
      result += target;
    }
  }

  return result;
}

export async function main() {
  const input = await readFile(inputPath);
  const parsedInput = parseInput(input);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, parsedInput);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, parsedInput);

  return {
    part1,
    part2,
    time1,
    time2,
  };
}
