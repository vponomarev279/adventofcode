import path from 'node:path';
import { readFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

type Coordinates = {
  x: number;
  y: number;
};

type Puzzle = {
  buttonA: Coordinates;
  buttonB: Coordinates;
  prize: Coordinates;
};

const inputPath = path.resolve(__dirname, 'input.txt');

function getButtonCoordinates(button: string) {
  const [x, y] = button.slice(10).split(', ');
  return {
    x: Number(x.slice(2)),
    y: Number(y.slice(2)),
  };
}

function getPrizeCoordinates(prize: string) {
  const [x, y] = prize.slice(7).split(', ');
  return {
    x: Number(x.slice(2)),
    y: Number(y.slice(2)),
  };
}

function parseInput(input: string) {
  const puzzles = input.split('\n\n');
  const result: Puzzle[] = [];

  for (const puzzle of puzzles) {
    const [buttonA, buttonB, prize] = puzzle.split('\n');

    result.push({
      buttonA: getButtonCoordinates(buttonA),
      buttonB: getButtonCoordinates(buttonB),
      prize: getPrizeCoordinates(prize),
    });
  }

  return result;
}

function findMinSolution({ buttonA, buttonB, prize }: Puzzle) {
  const yRemainder =
    (prize.y * buttonA.x - prize.x * buttonA.y) % (buttonA.x * buttonB.y - buttonB.x * buttonA.y);
  const y =
    (prize.y * buttonA.x - prize.x * buttonA.y) / (buttonA.x * buttonB.y - buttonB.x * buttonA.y);

  const x = (prize.x - buttonB.x * y) / buttonA.x;
  const xRemainder = (prize.x - buttonB.x * y) % buttonA.x;

  if (xRemainder !== 0 || yRemainder !== 0) {
    return 0;
  }

  return x * 3 + y;
}

function solvePart1(puzzles: Puzzle[]) {
  let result = 0;
  for (const puzzle of puzzles) {
    result += findMinSolution(puzzle);
  }
  return result;
}

function solvePart2(puzzles: Puzzle[]) {
  let result = 0;

  for (const puzzle of puzzles) {
    const prize = { x: puzzle.prize.x + 10000000000000, y: puzzle.prize.y + 10000000000000 };
    result += findMinSolution({
      buttonA: puzzle.buttonA,
      buttonB: puzzle.buttonB,
      prize,
    });
  }

  return result;
}

/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
 */

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
