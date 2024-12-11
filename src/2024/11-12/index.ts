import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseInput(input: string) {
  return input.split('\n')[0].split(' ');
}

function makeActionWithStone(stone: string, count: number, result: Map<string, number>) {
  if (stone === '0') {
    result.set('1', (result.get('1') ?? 0) + count);
  } else if (stone.length % 2 === 0) {
    const middle = stone.length / 2;
    const left = String(Number(stone.slice(0, middle)));
    const right = String(Number(stone.slice(middle)));

    result.set(left, (result.get(left) ?? 0) + count);
    result.set(right, (result.get(right) ?? 0) + count);
  } else {
    const newStone = String(Number(stone) * 2024);
    result.set(newStone, (result.get(newStone) ?? 0) + count);
  }
}

function makeBlink(stoneCounts: Map<string, number>) {
  const result: Map<string, number> = new Map();

  for (const [stone, count] of stoneCounts.entries()) {
    makeActionWithStone(stone, count, result);
  }

  stoneCounts.clear();

  for (const [stone, count] of result.entries()) {
    stoneCounts.set(stone, count);
  }
}

function getTotalCount(stoneCounts: Map<string, number>) {
  let totalStones = 0;

  for (const count of stoneCounts.values()) {
    totalStones += count;
  }

  return totalStones;
}

function solvePart1(input: string[]) {
  const stoneCounts: Map<string, number> = new Map();

  for (const stone of input) {
    stoneCounts.set(stone, (stoneCounts.get(stone) ?? 0) + 1);
  }

  for (let i = 0; i < 25; i++) {
    makeBlink(stoneCounts);
  }

  return getTotalCount(stoneCounts);
}

function solvePart2(input: string[]) {
  const stoneCounts: Map<string, number> = new Map();

  for (const stone of input) {
    stoneCounts.set(stone, (stoneCounts.get(stone) ?? 0) + 1);
  }

  for (let i = 0; i < 75; i++) {
    makeBlink(stoneCounts);
  }

  return getTotalCount(stoneCounts);
}

export async function main() {
  const input = parseInput(await readFile(inputPath));

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, input);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, input);

  return {
    part1,
    time1,
    part2,
    time2,
  };
}
