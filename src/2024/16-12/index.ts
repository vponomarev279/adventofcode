import path from 'node:path';
import Heap from 'heap-js';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

type Direction = 'top' | 'bottom' | 'left' | 'right';
type Item = { i: number; j: number; score: number; dir: Direction };
type ItemWithTiles = { i: number; j: number; score: number; dir: Direction; tiles: string[] };

function getNextDirs(current: Direction, i: number, j: number): Item[] {
  if (current === 'top') {
    return [
      { dir: 'top', i: i - 1, j, score: 1 },
      { dir: 'left', i, j, score: 1000 },
      { dir: 'right', i, j, score: 1000 },
    ];
  }

  if (current === 'bottom') {
    return [
      { dir: 'bottom', i: i + 1, j, score: 1 },
      { dir: 'left', i, j, score: 1000 },
      { dir: 'right', i, j, score: 1000 },
    ];
  }

  if (current === 'left') {
    return [
      { dir: 'left', i, j: j - 1, score: 1 },
      { dir: 'bottom', i, j, score: 1000 },
      { dir: 'top', i, j, score: 1000 },
    ];
  }

  return [
    { dir: 'right', i, j: j + 1, score: 1 },
    { dir: 'bottom', i, j, score: 1000 },
    { dir: 'top', i, j, score: 1000 },
  ];
}

function parseInput(input: string) {
  return input
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => line.split(''));
}

function findStart(matrix: string[][]) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'S') {
        return { i, j };
      }
    }
  }

  return { i: -1, j: -1 };
}

function findMinScore(matrix: string[][], nodes: Heap<ItemWithTiles>) {
  const visited: Set<string> = new Set();
  let paths: string[][] = [];
  let minScore = Infinity;

  while (nodes.length) {
    const node = nodes.pop()!;

    if (matrix[node.i][node.j] === 'E') {
      if (node.score < minScore) {
        paths = [];
        paths.push(node.tiles);
        minScore = node.score;
      } else {
        paths.push(node.tiles);
      }
    }

    const nextDirs = getNextDirs(node.dir, node.i, node.j);

    for (const next of nextDirs) {
      const nextI = next.i;
      const nextJ = next.j;
      const nextScore = node.score + next.score;

      if (
        nextI >= 0 &&
        nextI < matrix.length &&
        nextJ >= 0 &&
        nextJ < matrix[0].length &&
        !visited.has(`${nextI}:${nextJ}:${next.dir}`) &&
        matrix[nextI][nextJ] !== '#'
      ) {
        visited.add(`${nextI}:${nextJ}:${next.dir}`);
        const nextTiles = node.tiles.slice();
        nextTiles.push(`${nextI}:${nextJ}:${nextScore}`);
        nodes.push({
          i: nextI,
          j: nextJ,
          dir: next.dir,
          score: nextScore,
          tiles: nextTiles,
        });
      }
    }
  }

  return { score: minScore, paths };
}

function solvePart1(matrix: string[][]) {
  const start = findStart(matrix);
  const nodes = new Heap<ItemWithTiles>((a: Item, b: Item) => a.score - b.score);
  nodes.push({
    i: start.i,
    j: start.j,
    dir: 'right',
    tiles: [`${start.i}:${start.j}`],
    score: 0,
  });

  const { score } = findMinScore(matrix, nodes);
  return score;
}

function solvePart2(matrix: string[][]) {
  const start = findStart(matrix);
  const nodes = new Heap<ItemWithTiles>((a: Item, b: Item) => a.score - b.score);
  nodes.push({
    i: start.i,
    j: start.j,
    dir: 'right',
    tiles: [`${start.i}:${start.j}`],
    score: 0,
  });

  const { paths } = findMinScore(matrix, nodes);
  const uniqueTiles = new Set();

  for (const tiles of paths) {
    for (const tile of tiles) {
      uniqueTiles.add(tile);
    }
  }

  return uniqueTiles.size;
}

export async function main() {
  const file = await readFile(inputPath);
  const matrix = parseInput(file);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, matrix);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, matrix);

  return {
    part1,
    time1,
    part2,
    time2,
  };
}
