import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseRules(str: string) {
  const rules: number[][] = [];

  for (const ord of str.split('\n').filter((line) => line !== '')) {
    const [left, right] = ord.split('|');
    rules.push([Number(left), Number(right)]);
  }

  return rules;
}

function parseUpdates(str: string) {
  const updates: number[][] = [];

  for (const updateLine of str.split('\n').filter((line) => line !== '')) {
    updates.push(updateLine.split(',').map(Number));
  }

  return updates;
}

function makeSorter(rules: number[][]) {
  return function (a: number, b: number) {
    const preceed = rules.filter((r) => r[0] === a);

    if (preceed.find((r) => r[1] === b)) {
      return -1;
    }

    const succeed = rules.filter((r) => r[1] === a);

    if (succeed.find((r) => r[0] === b)) {
      return 1;
    }

    return 0;
  };
}

function isSameArray(a: number[], b: number[]) {
  return a.length === b.length && a.every((val, ix) => val === b[ix]);
}

function solvePart1(rules: number[][], updates: number[][]) {
  const sorter = makeSorter(rules);

  return updates
    .filter((nums) => isSameArray(nums, nums.toSorted(sorter)))
    .reduce((prev, current) => prev + current[Math.floor(current.length / 2)], 0);
}

function solvePart2(rules: number[][], updates: number[][]) {
  const sorter = makeSorter(rules);

  return updates
    .map((nums) => {
      const sorted = nums.toSorted(sorter);
      return isSameArray(nums, sorted) ? [] : sorted;
    })
    .filter((nums) => nums.length)
    .reduce((prev, current) => prev + current[Math.floor(current.length / 2)], 0);
}

export async function main() {
  const input = await readFile(inputPath);

  const [rulesInput, updatesInput] = input.split('\n\n');
  const rules = parseRules(rulesInput);
  const updates = parseUpdates(updatesInput);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, rules, updates);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, rules, updates);

  return {
    part1,
    part2,
    time1,
    time2,
  };
}
