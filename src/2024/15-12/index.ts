import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');

type Map = string[][];
type Move = '<' | '>' | '^' | 'v';
type Coordinates = { i: number; j: number };

function parseInput(input: string) {
  const moves: Move[] = [];

  const [map, movesStr] = input.split('\n\n');
  for (const movesLine of movesStr.split('\n').filter((line) => line !== '')) {
    moves.push(...(movesLine.split('') as Move[]));
  }

  return {
    matrix: map.split('\n').map((line) => line.split('')),
    moves,
  };
}

function findRobotPosition(matrix: Map): Coordinates {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === '@') {
        return {
          i,
          j,
        };
      }
    }
  }

  return { i: -1, j: -1 };
}

function isInBounds(matrix: Map, i: number, j: number) {
  return i > 0 && i < matrix.length - 1 && j > 0 && j < matrix[0].length - 1;
}

function calcNext(coordinates: Coordinates, move: Move) {
  if (move === '>') {
    return { i: coordinates.i, j: coordinates.j + 1 };
  }

  if (move === '<') {
    return { i: coordinates.i, j: coordinates.j - 1 };
  }

  if (move === 'v') {
    return { i: coordinates.i + 1, j: coordinates.j };
  }

  return { i: coordinates.i - 1, j: coordinates.j };
}

function moveBlocks({ matrix, blocks, move }: { matrix: Map; blocks: Coordinates[]; move: Move }) {
  blocks.reverse();

  const { i: lastI, j: lastJ } = calcNext(blocks[0], move);
  if (matrix[lastI][lastJ] !== '#') {
    for (const coordinates of blocks) {
      const { i: nextI, j: nextJ } = calcNext(coordinates, move);
      matrix[nextI][nextJ] = 'O';
      matrix[coordinates.i][coordinates.j] = '.';
    }
  }
}

function getRobotNext(matrix: Map, robot: Coordinates, move: Move) {
  const { i: robotNextI, j: robotNextJ } = calcNext(robot, move);

  if (matrix[robotNextI][robotNextJ] === '.') {
    matrix[robot.i][robot.j] = '.';
    matrix[robotNextI][robotNextJ] = '@';

    return {
      i: robotNextI,
      j: robotNextJ,
    };
  }

  return robot;
}

function makeMove(matrix: Map, move: Move, robot: Coordinates) {
  const blocks: Coordinates[] = [];

  let { i, j } = calcNext(robot, move);
  while (isInBounds(matrix, i, j) && matrix[i][j] === 'O') {
    blocks.push({ i, j });

    const { i: nextI, j: nextJ } = calcNext({ i, j }, move);
    i = nextI;
    j = nextJ;
  }

  if (blocks.length) {
    moveBlocks({ matrix, blocks, move });
  }

  return getRobotNext(matrix, robot, move);
}

function getDoubledBox(matrix: Map, i: number, j: number) {
  if (matrix[i][j] === ']') {
    return [
      { i, j: j - 1 },
      { i, j },
    ];
  }

  return [
    { i, j },
    { i, j: j + 1 },
  ];
}

function calcGPSCoordinates(matrix: string[][]) {
  let result = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'O') {
        result += i * 100 + j;
      }
    }
  }

  return result;
}

function buildDoubledMatrix(matrix: string[][]) {
  const doubledMatrix: string[][] = new Array(matrix.length)
    .fill(0)
    .map(() => new Array(matrix[0].length * 2).fill(0));

  for (let i = 0; i < matrix.length; i++) {
    let doubledJ = 0;
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === '#' || matrix[i][j] === '.') {
        doubledMatrix[i][doubledJ] = matrix[i][j];
        doubledMatrix[i][doubledJ + 1] = matrix[i][j];
      } else if (matrix[i][j] === 'O') {
        doubledMatrix[i][doubledJ] = '[';
        doubledMatrix[i][doubledJ + 1] = ']';
      } else {
        doubledMatrix[i][doubledJ] = '@';
        doubledMatrix[i][doubledJ + 1] = '.';
      }

      doubledJ += 2;
    }
  }

  return doubledMatrix;
}

function solvePart1({ matrix, moves }: { matrix: Map; moves: Move[] }) {
  let robot = findRobotPosition(matrix);

  for (const move of moves) {
    robot = makeMove(matrix, move, robot);
  }

  return calcGPSCoordinates(matrix);
}

function getBlocksToMoveWithDoubleBoxes(matrix: Map, move: Move, robot: Coordinates) {
  const blocks: Coordinates[][][] = [];

  let queue: Coordinates[][] = [
    [
      { i: robot.i, j: robot.j },
      { i: robot.i, j: robot.j },
    ],
  ];

  while (queue.length) {
    const nextQueue: Coordinates[][] = [];

    for (const [left, right] of queue) {
      if (move === '<') {
        const { i: nextI, j: nextJ } = calcNext(left, move);

        if (matrix[nextI][nextJ] === ']' || matrix[nextI][nextJ] === '[') {
          nextQueue.push(getDoubledBox(matrix, nextI, nextJ));
        }
      } else if (move === '>') {
        const { i: nextI, j: nextJ } = calcNext(right, move);

        if (matrix[nextI][nextJ] === '[') {
          nextQueue.push([{ i: nextI, j: nextJ }, calcNext({ i: nextI, j: nextJ }, move)]);
        }
      } else if (move === '^' || move === 'v') {
        const { i: leftNextI, j: leftNextJ } = calcNext(left, move);
        const { i: rightNextI, j: rightNextJ } = calcNext(right, move);

        if (matrix[leftNextI][leftNextJ] === '[' || matrix[leftNextI][leftNextJ] === ']') {
          nextQueue.push(getDoubledBox(matrix, leftNextI, leftNextJ));
        }

        if (
          (leftNextI !== rightNextI || leftNextJ !== rightNextJ) &&
          (matrix[rightNextI][rightNextJ] === '[' || matrix[rightNextI][rightNextJ] === ']')
        ) {
          nextQueue.push(getDoubledBox(matrix, rightNextI, rightNextJ));
        }
      }
    }

    if (nextQueue.length) {
      blocks.push(nextQueue.toReversed());
    }
    queue = nextQueue;
  }

  return blocks.toReversed();
}

function moveBlocksByLevel(matrix: Map, blocks: Coordinates[][], move: Move) {
  for (const block of blocks) {
    const [left, right] = block;

    const { i: nextLeftI, j: nextLeftJ } = calcNext(left, move);
    const { i: nextRightI, j: nextRightJ } = calcNext(right, move);

    if (matrix[nextLeftI][nextLeftJ] === '#' || matrix[nextRightI][nextRightJ] === '#') {
      return false;
    }

    matrix[nextLeftI][nextLeftJ] = '[';
    matrix[nextRightI][nextRightJ] = ']';
    if (move === '<') {
      matrix[right.i][right.j] = '.';
    } else if (move === '>') {
      matrix[left.i][left.j] = '.';
    } else {
      matrix[left.i][left.j] = '.';
      matrix[right.i][right.j] = '.';
    }
  }

  return true;
}

function calcGPSDoubledCoordinates(matrix: string[][]) {
  let result = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === '[') {
        result += i * 100 + j;
      }
    }
  }

  return result;
}

function solvePart2({ matrix, moves }: { matrix: Map; moves: Move[] }) {
  let robot = findRobotPosition(matrix);

  for (const move of moves) {
    const blocks = getBlocksToMoveWithDoubleBoxes(matrix, move, robot);

    for (const block of blocks) {
      if (!moveBlocksByLevel(matrix, block, move)) {
        break;
      }
    }

    robot = getRobotNext(matrix, robot, move);
  }

  return calcGPSDoubledCoordinates(matrix);
}

export async function main() {
  const file = await readFile(inputPath);
  const input = parseInput(file);
  const doubledMatrix = buildDoubledMatrix(input.matrix);

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, input);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, {
    matrix: doubledMatrix,
    moves: input.moves,
  });

  return {
    part1,
    time1,
    part2,
    time2,
  };
}
