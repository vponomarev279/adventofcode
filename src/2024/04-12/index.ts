import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

function parseInput(input: string) {
  return input.split('\n').map((line) => line.split(''));
}

function checkHorizontalFront(matrix: string[][], i: number, j: number) {
  if (j + 3 < matrix[0].length) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i][j + 1] === 'M' &&
      matrix[i][j + 2] === 'A' &&
      matrix[i][j + 3] === 'S'
    );
  }

  return false;
}

function checkHorizontalBack(matrix: string[][], i: number, j: number) {
  if (j - 3 >= 0) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i][j - 1] === 'M' &&
      matrix[i][j - 2] === 'A' &&
      matrix[i][j - 3] === 'S'
    );
  }

  return false;
}

function checkVerticalDown(matrix: string[][], i: number, j: number) {
  if (i + 3 < matrix.length) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i + 1][j] === 'M' &&
      matrix[i + 2][j] === 'A' &&
      matrix[i + 3][j] === 'S'
    );
  }

  return false;
}

function checkVerticalUp(matrix: string[][], i: number, j: number) {
  if (i - 3 >= 0) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i - 1][j] === 'M' &&
      matrix[i - 2][j] === 'A' &&
      matrix[i - 3][j] === 'S'
    );
  }

  return false;
}

function checkDiagonalRightDown(matrix: string[][], i: number, j: number) {
  if (i + 3 < matrix.length && j + 3 < matrix[0].length) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i + 1][j + 1] === 'M' &&
      matrix[i + 2][j + 2] === 'A' &&
      matrix[i + 3][j + 3] === 'S'
    );
  }

  return false;
}

function checkDiagonalLeftDown(matrix: string[][], i: number, j: number) {
  if (i + 3 < matrix.length && j - 3 >= 0) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i + 1][j - 1] === 'M' &&
      matrix[i + 2][j - 2] === 'A' &&
      matrix[i + 3][j - 3] === 'S'
    );
  }

  return false;
}

function checkDiagonalRightUp(matrix: string[][], i: number, j: number) {
  if (i - 3 >= 0 && j + 3 < matrix[0].length) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i - 1][j + 1] === 'M' &&
      matrix[i - 2][j + 2] === 'A' &&
      matrix[i - 3][j + 3] === 'S'
    );
  }

  return false;
}

function checkDiagonalLeftUp(matrix: string[][], i: number, j: number) {
  if (i - 3 >= 0 && j - 3 >= 0) {
    return (
      matrix[i][j] === 'X' &&
      matrix[i - 1][j - 1] === 'M' &&
      matrix[i - 2][j - 2] === 'A' &&
      matrix[i - 3][j - 3] === 'S'
    );
  }

  return false;
}

function checkXmas(matrix: string[][], i: number, j: number) {
  if (i - 1 >= 0 && i + 1 < matrix.length && j - 1 >= 0 && j + 1 < matrix[0].length) {
    if (
      matrix[i - 1][j - 1] === 'M' &&
      matrix[i - 1][j + 1] === 'S' &&
      matrix[i + 1][j - 1] === 'M' &&
      matrix[i + 1][j + 1] === 'S'
    ) {
      return true;
    }

    if (
      matrix[i - 1][j - 1] === 'S' &&
      matrix[i - 1][j + 1] === 'S' &&
      matrix[i + 1][j - 1] === 'M' &&
      matrix[i + 1][j + 1] === 'M'
    ) {
      return true;
    }

    if (
      matrix[i - 1][j - 1] === 'S' &&
      matrix[i - 1][j + 1] === 'M' &&
      matrix[i + 1][j - 1] === 'S' &&
      matrix[i + 1][j + 1] === 'M'
    ) {
      return true;
    }

    if (
      matrix[i - 1][j - 1] === 'M' &&
      matrix[i - 1][j + 1] === 'M' &&
      matrix[i + 1][j - 1] === 'S' &&
      matrix[i + 1][j + 1] === 'S'
    ) {
      return true;
    }
  }

  return false;
}

function solvePart1(matrix: string[][]) {
  let result = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'X') {
        result += checkHorizontalFront(matrix, i, j) ? 1 : 0;
        result += checkHorizontalBack(matrix, i, j) ? 1 : 0;
        result += checkVerticalDown(matrix, i, j) ? 1 : 0;
        result += checkVerticalUp(matrix, i, j) ? 1 : 0;
        result += checkDiagonalRightDown(matrix, i, j) ? 1 : 0;
        result += checkDiagonalRightUp(matrix, i, j) ? 1 : 0;
        result += checkDiagonalLeftDown(matrix, i, j) ? 1 : 0;
        result += checkDiagonalLeftUp(matrix, i, j) ? 1 : 0;
      }
    }
  }

  return result;
}

function solvePart2(matrix: string[][]) {
  let result = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'A' && checkXmas(matrix, i, j)) {
        result += 1;
      }
    }
  }

  return result;
}

export async function main() {
  const input = await readFile(inputPath);
  const matrix = parseInput(input);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, matrix);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, matrix);

  return {
    part1,
    part2,
    time1,
    time2,
  };
}
