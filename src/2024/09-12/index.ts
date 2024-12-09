import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseInput(input: string) {
  return input.slice(0, input.length - 1);
}

function getBlocks(disk: string) {
  const result: string[] = [];

  let lastBlockId = 0;

  for (let i = 0; i < disk.length; i++) {
    const current = Number(disk[i]);
    for (let j = 0; j < current; j++) {
      result.push(i % 2 === 0 ? `${lastBlockId}` : '.');
    }

    lastBlockId += i % 2 ? 1 : 0;
  }

  return result;
}

function getCheckSum(blocks: string[]) {
  let result = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== '.') {
      result += Number(blocks[i]) * i;
    }
  }

  return result;
}

function normalizeBlocksByIds(blocks: string[]) {
  let left = 0;
  let right = blocks.length - 1;

  while (left < right) {
    while (right > left && blocks[right] === '.') {
      right -= 1;
    }

    while (left < right && blocks[left] !== '.') {
      left += 1;
    }

    if (blocks[left] === '.' && blocks[right] !== '.') {
      blocks[left] = blocks[right];
      blocks[right] = '.';
    }
  }
}

function findLeftmostEmptySpaceStart(blocks: string[], minLength: number, end: number) {
  let count = blocks[0] === '.' ? 1 : 0;

  for (let i = 1; i < end; i++) {
    if (blocks[i] === '.') {
      count += 1;
    } else {
      count = 0;
    }

    if (count >= minLength) {
      return i - count + 1;
    }
  }

  return -1;
}

function normalizeBlocksByFiles(blocks: string[]) {
  // console.log({ blocks: blocks.join('') });
  // const emptySpaces: Set<number> = new Set();
  let right = blocks.length - 1;

  while (right >= 0) {
    let rightCount = 0;

    while (right >= 0 && blocks[right] === '.') {
      right -= 1;
    }

    let currentRight = blocks[right];
    while (right >= 0 && blocks[right] === currentRight) {
      rightCount += 1;
      right -= 1;
    }

    // blocks: string[], minLength: number, end: number
    const leftStart = findLeftmostEmptySpaceStart(blocks, rightCount, right + 1);
    if (leftStart !== -1) {
      for (let j = 0; j < rightCount; j++) {
        blocks[leftStart + j] = blocks[right + rightCount - j];
        blocks[right + rightCount - j] = '.';
      }
    }
  }

  /*
  while (right >= 0) {
    let left = 0;
    let leftCount = 0;
    let rightCount = 0;

    while (right >= 0 && blocks[right] === '.') {
      right -= 1;
    }

    let currentRight = blocks[right];
    while (right >= 0 && blocks[right] === currentRight) {
      rightCount += 1;
      right -= 1;
    }

    while (left < right && left < blocks.length && leftCount < rightCount) {
      if (blocks[left] === '.') {
        leftCount += 1;
      } else {
        leftCount = 0;
      }

      left += 1;
    }

    if (leftCount >= rightCount) {
      for (let j = 0; j < rightCount; j++) {
        blocks[left - leftCount + j] = blocks[right + rightCount - j];
        blocks[right + rightCount - j] = '.';
      }
    }
  }
   */
}

function solvePart1(initialBlocks: string[]) {
  const blocks = initialBlocks.concat();
  normalizeBlocksByIds(blocks);

  return getCheckSum(blocks);
}

function solvePart2(initialBlocks: string[]) {
  const blocks = initialBlocks.concat();
  normalizeBlocksByFiles(blocks);

  return getCheckSum(blocks);
}

export async function main() {
  const input = parseInput(await readFile(inputPath));
  const blocks = getBlocks(input);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, blocks);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, blocks);

  return {
    part1,
    time1,
    part2,
    time2,
  };
}
