import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseInput(input: string) {
  return input
    .split('\n')
    .filter((line) => line !== '')
    .map((line) => line.split(''));
}

function getAntennas(matrix: string[][]) {
  const antennas: Map<string, number[][]> = new Map();

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== '.') {
        if (!antennas.has(matrix[i][j])) {
          antennas.set(matrix[i][j], []);
        }

        antennas.get(matrix[i][j])!.push([i, j]);
      }
    }
  }

  return antennas;
}

function getPairs(coordinates: number[][]) {
  const pairs: number[][][] = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      pairs.push([coordinates[i], coordinates[j]]);
    }
  }

  return pairs;
}

function isInBoundaries(matrix: string[][], pair: number[]) {
  return pair[0] >= 0 && pair[0] < matrix.length && pair[1] >= 0 && pair[1] < matrix[0].length;
}

function getCoordinatesOfAntinodes(a: number[], b: number[]) {
  const first = [(a[0] - 2 * b[0]) / -1, (a[1] - 2 * b[1]) / -1];
  const second = [(b[0] - 2 * a[0]) / -1, (b[1] - 2 * a[1]) / -1];

  return [first, second];
}

function getPrevAntinode(i: number, j: number, diffI: number, diffJ: number) {
  return [i - diffI, j - diffJ];
}

function getNextAntinode(i: number, j: number, diffI: number, diffJ: number) {
  return [i + diffI, j + diffJ];
}

function solvePart1(antennas: Map<string, number[][]>, matrix: string[][]) {
  const antinodesSet = new Set();

  for (const value of antennas.values()) {
    const pairs = getPairs(value);
    for (const pair of pairs) {
      const antinodes = getCoordinatesOfAntinodes(pair[0], pair[1]);

      if (isInBoundaries(matrix, antinodes[0])) {
        antinodesSet.add(`${antinodes[0][0]}:${antinodes[0][1]}`);
      }

      if (isInBoundaries(matrix, antinodes[1])) {
        antinodesSet.add(`${antinodes[1][0]}:${antinodes[1][1]}`);
      }
    }
  }

  return antinodesSet.size;
}

function solvePart2(antennas: Map<string, number[][]>, matrix: string[][]) {
  const antinodesSet = new Set();

  for (const value of antennas.values()) {
    const pairs = getPairs(value);

    for (const pair of pairs) {
      const up = pair[0][0] < pair[0][1] ? pair[0] : pair[1];
      const down = pair[0][0] < pair[0][1] ? pair[1] : pair[0];
      const diffI = up[0] - down[0];
      const diffJ = up[1] - down[1];

      let upPair = getPrevAntinode(up[0], up[1], diffI, diffJ);
      let downPair = getNextAntinode(down[0], down[1], diffI, diffJ);

      while (isInBoundaries(matrix, upPair)) {
        antinodesSet.add(`${upPair[0]}:${upPair[1]}`);
        upPair = getPrevAntinode(upPair[0], upPair[1], diffI, diffJ)
      }

      while (isInBoundaries(matrix, downPair)) {
        antinodesSet.add(`${downPair[0]}:${downPair[1]}`);
        downPair = getNextAntinode(downPair[0], downPair[1], diffI, diffJ)
      }
    }
  }

  return antinodesSet.size;
}

export async function main() {
  const input = await readFile(inputPath);
  const matrix = parseInput(input);
  const antennas = getAntennas(matrix);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, antennas, matrix);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, antennas, matrix);

  return {
    part1,
    time1,
    part2,
    time2,
  };
}
