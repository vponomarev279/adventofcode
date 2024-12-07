import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseInput(input: string) {
  const result = input.split('\n').map((line) => line.split(' ').map(Number));
  result.pop();

  return result;
}

function isSafeLevel(level: number[]) {
  const increasing = level[0] < level[1];

  for (let i = 0; i < level.length - 1; i++) {
    const diff = Math.abs(level[i] - level[i + 1]);

    if (diff < 1 || diff > 3) {
      return false;
    }

    if (increasing && level[i] > level[i + 1]) {
      return false;
    }

    if (!increasing && level[i] < level[i + 1]) {
      return false;
    }
  }

  return true;
}

function solvePart1(levels: number[][]) {
  let result = 0;

  for (const level of levels) {
    result += isSafeLevel(level) ? 1 : 0;
  }

  return result;
}

function solvePart2(levels: number[][]) {
  let result = 0;

  for (const level of levels) {
    if (isSafeLevel(level)) {
      result += 1;
      continue;
    }

    for (let i = 0; i < level.length; i++) {
      const clone = level.slice();
      clone.splice(i, 1);

      if (isSafeLevel(clone)) {
        result += 1;
        break;
      }
    }
  }

  return result;
}

export async function main() {
  const input = await readFile(inputPath);
  const levels = parseInput(input);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, levels);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, levels);

  return {
    part1,
    part2,
    time1,
    time2,
  };
}
