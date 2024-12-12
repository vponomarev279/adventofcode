import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

type Fences = {
  left: number[][];
  right: number[][];
  up: number[][];
  down: number[][];
  count: number;
};

const inputPath = path.resolve(__dirname, 'input.txt');

const dirs = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function hasUpFence(matrix: string[][], i: number, j: number) {
  return i === 0 || (i - 1 >= 0 && matrix[i][j] !== matrix[i - 1][j]);
}

function hasDownFence(matrix: string[][], i: number, j: number) {
  return i === matrix.length - 1 || (i + 1 < matrix.length && matrix[i][j] !== matrix[i + 1][j]);
}

function hasLeftFence(matrix: string[][], i: number, j: number) {
  return j === 0 || (j - 1 >= 0 && matrix[i][j] !== matrix[i][j - 1]);
}

function hasRightFence(matrix: string[][], i: number, j: number) {
  return (
    j === matrix[0].length - 1 || (j + 1 < matrix[0].length && matrix[i][j] !== matrix[i][j + 1])
  );
}

function calcSides(fences: Fences) {
  let sides = 4;

  fences.left.sort((a, b) => {
    if (a[1] !== b[1]) {
      return a[1] - b[1];
    }

    return a[0] - b[0];
  });
  for (let i = 1; i < fences.left.length; i++) {
    if (
      fences.left[i][1] !== fences.left[i - 1][1] ||
      fences.left[i][0] !== fences.left[i - 1][0] + 1
    ) {
      sides += 1;
    }
  }

  fences.right.sort((a, b) => {
    if (a[1] !== b[1]) {
      return a[1] - b[1];
    }

    return a[0] - b[0];
  });
  for (let i = 1; i < fences.right.length; i++) {
    if (
      fences.right[i][1] !== fences.right[i - 1][1] ||
      fences.right[i][0] !== fences.right[i - 1][0] + 1
    ) {
      sides += 1;
    }
  }

  fences.up.sort((a, b) => {
    if (a[0] !== b[0]) {
      return a[0] - b[0];
    }

    return a[1] - b[1];
  });
  for (let i = 1; i < fences.up.length; i++) {
    if (fences.up[i][0] !== fences.up[i - 1][0] || fences.up[i][1] !== fences.up[i - 1][1] + 1) {
      sides += 1;
    }
  }

  fences.down.sort((a, b) => {
    if (a[0] !== b[0]) {
      return a[0] - b[0];
    }

    return a[1] - b[1];
  });
  for (let i = 1; i < fences.down.length; i++) {
    if (
      fences.down[i][0] !== fences.down[i - 1][0] ||
      fences.down[i][1] !== fences.down[i - 1][1] + 1
    ) {
      sides += 1;
    }
  }

  return sides;
}

function calcFence(matrix: string[][], i: number, j: number) {
  let count = 0;
  let left,
    right,
    up,
    down = false;

  if (hasUpFence(matrix, i, j)) {
    count += 1;
    up = true;
  }

  if (hasDownFence(matrix, i, j)) {
    count += 1;
    down = true;
  }

  if (hasLeftFence(matrix, i, j)) {
    count += 1;
    left = true;
  }

  if (hasRightFence(matrix, i, j)) {
    count += 1;
    right = true;
  }

  return {
    left,
    right,
    up,
    down,
    count,
  };
}

function setFencesForPlot(matrix: string[][], i: number, j: number, fences: Fences) {
  const { count, left, right, up, down } = calcFence(matrix, i, j);

  if (left) {
    fences.left.push([i, j]);
  }

  if (right) {
    fences.right.push([i, j]);
  }

  if (up) {
    fences.up.push([i, j]);
  }

  if (down) {
    fences.down.push([i, j]);
  }

  fences.count += count;
}

function findRegion(matrix: string[][], startI: number, startJ: number, visited: Set<string>) {
  const region = matrix[startI][startJ];
  let square = 1;
  const fences: Fences = {
    left: [],
    right: [],
    up: [],
    down: [],
    count: 0,
  };

  setFencesForPlot(matrix, startI, startJ, fences);

  let queue: number[][] = [[startI, startJ]];
  visited.add(`${startI}:${startJ}`);

  while (queue.length > 0) {
    const nextQueue: number[][] = [];

    for (const [i, j] of queue) {
      for (const dir of dirs) {
        const nextI = i + dir[0];
        const nextJ = j + dir[1];

        if (
          nextI >= 0 &&
          nextI < matrix.length &&
          nextJ >= 0 &&
          nextJ < matrix[0].length &&
          !visited.has(`${nextI}:${nextJ}`) &&
          matrix[nextI][nextJ] === region
        ) {
          visited.add(`${nextI}:${nextJ}`);
          nextQueue.push([nextI, nextJ]);
          square += 1;
          setFencesForPlot(matrix, nextI, nextJ, fences);
        }
      }
    }

    queue = nextQueue;
  }

  return { square, fences };
}

function solvePart1(matrix: string[][]) {
  let score = 0;
  const visited: Set<string> = new Set();

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (!visited.has(`${i}:${j}`)) {
        const { square, fences } = findRegion(matrix, i, j, visited);

        score += square * fences.count;
      }
    }
  }

  return score;
}

function solvePart2(matrix: string[][]) {
  let score = 0;
  const visited: Set<string> = new Set();

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (!visited.has(`${i}:${j}`)) {
        const { square, fences } = findRegion(matrix, i, j, visited);
        const sides = calcSides(fences);

        score += square * sides;
      }
    }
  }

  return score;
}

function parseInput(input: string) {
  return input
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => line.split(''));
}

export async function main() {
  const matrix = parseInput(await readFile(inputPath));

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, matrix);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, matrix);

  return {
    part1,
    time1,
    part2,
    time2,
  };
}
