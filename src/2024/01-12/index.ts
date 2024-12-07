import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseInput(input: string) {
  const left: number[] = [];
  const right: number[] = [];

  for (const line of input.split('\n').filter((line) => line !== '')) {
    const [a, b] = line.split('   ').map(Number);

    left.push(a);
    right.push(b);
  }

  return { left, right };
}

function getCounts(nums: number[]) {
  const result: Map<number, number> = new Map();

  for (const num of nums) {
    result.set(num, (result.get(num) ?? 0) + 1);
  }

  return result;
}

function solvePart1(left: number[], right: number[]) {
  let result = 0;

  left.sort();
  right.sort();

  for (let i = 0; i < left.length; i++) {
    result += Math.abs(left[i] - right[i]);
  }

  return result;
}

function solvePart2(left: number[], right: number[]) {
  const rightCounts = getCounts(right);
  let result = 0;

  for (const num of left) {
    result += num * (rightCounts.get(num) ?? 0);
  }

  return result;
}

export async function main() {
  const input = await readFile(inputPath);
  const { left, right } = parseInput(input);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, left, right);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, left, right);

  return {
    part1,
    part2,
    time1,
    time2,
  };
}
