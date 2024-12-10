import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseInput(input: string) {
  return input
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => line.split('').map(Number));
}

type QueueNode = {
  i: number;
  j: number;
  route: string;
};

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function bfs(matrix: number[][], startI: number, startJ: number) {
  let result = 0;
  let queue: QueueNode[] = [
    {
      i: startI,
      j: startJ,
      route: `${startI}:${startJ}`,
    },
  ];
  const reached: Set<string> = new Set();
  const visited: Set<string> = new Set([`${startI}:${startJ}`]);

  while (queue.length) {
    const nextQueue: QueueNode[] = [];

    for (const { i, j, route } of queue) {
      for (const dir of dirs) {
        const nextI = i + dir[0];
        const nextJ = j + dir[1];

        if (
          nextI >= 0 &&
          nextI < matrix.length &&
          nextJ >= 0 &&
          nextJ < matrix[0].length &&
          matrix[i][j] + 1 === matrix[nextI][nextJ] &&
          !visited.has(`${route};${nextI}:${nextJ}`)
        ) {
          if (matrix[nextI][nextJ] === 9) {
            reached.add(`${nextI}:${nextJ}`);
            result += 1;
          }

          nextQueue.push({ i: nextI, j: nextJ, route: `${route};${nextI}:${nextJ}` });
          visited.add(`${route};${nextI}:${nextJ}`);
        }
      }
    }

    queue = nextQueue;
  }

  return { paths: result, reached: reached.size };
}

function solvePart1(matrix: number[][]) {
  let result = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0) {
        const { reached } = bfs(matrix, i, j);
        result += reached;
      }
    }
  }

  return result;
}

function solvePart2(matrix: number[][]) {
  let result = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0) {
        const { paths } = bfs(matrix, i, j);
        result += paths;
      }
    }
  }

  return result;
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
