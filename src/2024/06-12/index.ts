import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

type Direction = 'up' | 'right' | 'down' | 'left';

function makeMatrix(inp: string) {
  const matrix: string[][] = [];
  let startI = 0;
  let startJ = 0;

  for (const line of inp.split('\n')) {
    if (line.includes('^')) {
      startI = matrix.length;
      startJ = line.indexOf('^');
    }

    matrix.push(line.split(''));
  }

  return { matrix, startI, startJ };
}

function isInBound(matrix: string[][], i: number, j: number) {
  return i < matrix.length && i >= 0 && j < matrix[0].length && j >= 0;
}

function getDirection(direction: Direction): { current: number[]; next: Direction } {
  if (direction === 'up') {
    return {
      current: [-1, 0],
      next: 'right',
    };
  }

  if (direction === 'down') {
    return {
      current: [1, 0],
      next: 'left',
    };
  }

  if (direction === 'left') {
    return {
      current: [0, -1],
      next: 'up',
    };
  }

  return {
    current: [0, 1],
    next: 'down',
  };
}

function getVisitedCells(matrix: string[][], startI: number, startJ: number): number[][] {
  const visited = new Set<string>();
  const cells: number[][] = [];

  let i = startI,
    j = startJ,
    direction: Direction = 'up';

  while (isInBound(matrix, i, j)) {
    const { current, next } = getDirection(direction);
    if (!visited.has(`${i}:${j}`)) {
      visited.add(`${i}:${j}`);
      cells.push([i, j]);
    }

    const nextI = i + current[0];
    const nextJ = j + current[1];

    if (isInBound(matrix, nextI, nextJ) && matrix[nextI][nextJ] === '#') {
      direction = next;
    } else {
      i = nextI;
      j = nextJ;
    }
  }

  return cells;
}

function hasCycle(matrix: string[][], startI: number, startJ: number, dir: Direction) {
  const visited = new Set<string>();
  let i = startI,
    j = startJ,
    direction = dir;

  while (isInBound(matrix, i, j)) {
    const { current, next } = getDirection(direction);
    if (visited.has(`${i}:${j}:${direction}`)) {
      return true;
    }

    visited.add(`${i}:${j}:${direction}`);
    const nextI = i + current[0];
    const nextJ = j + current[1];

    if (isInBound(matrix, nextI, nextJ) && matrix[nextI][nextJ] === '#') {
      direction = next;
    } else {
      i = nextI;
      j = nextJ;
    }
  }

  return false;
}

function solvePart1(matrix: string[][], startI: number, startJ: number) {
  const cells = getVisitedCells(matrix, startI, startJ);

  return cells.length;
}

function solvePart2(matrix: string[][], startI: number, startJ: number) {
  let cycleCount = 0;

  const possibleObstacles = getVisitedCells(matrix, startI, startJ);

  for (const [obstacleI, obstacleJ] of possibleObstacles) {
    if (obstacleI === startI && obstacleJ === startJ) {
      continue;
    }

    matrix[obstacleI][obstacleJ] = '#';
    if (hasCycle(matrix, startI, startJ, 'up')) {
      cycleCount += 1;
    }

    matrix[obstacleI][obstacleJ] = '.';
  }

  return cycleCount;
}

export async function main() {
  const input = await readFile(inputPath);
  const { matrix, startI, startJ } = makeMatrix(input);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, matrix, startI, startJ);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, matrix, startI, startJ);

  return {
    part1,
    part2,
    time1,
    time2,
  };
}
