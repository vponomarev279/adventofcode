import path from 'node:path';
import { appendFile, readFile, writeFile } from '../../lib/file.lib';
import { executeWithTiming } from '../../lib/measure.lib';

const inputPath = path.resolve(__dirname, 'input.txt');
const outputPath = path.resolve(__dirname, 'output.txt');

type Robot = {
  x: number;
  y: number;
  velocity: {
    x: number;
    y: number;
  };
};

function parseInput(input: string) {
  const result: Robot[] = [];
  for (const line of input.split('\n').filter((l) => l !== '')) {
    const [p, v] = line.split(' ');
    const [px, py] = p.slice(2).split(',').map(Number);
    const [vx, vy] = v.slice(2).split(',').map(Number);

    result.push({
      x: px,
      y: py,
      velocity: {
        x: vx,
        y: vy,
      },
    });
  }

  return result;
}

function getQuadrant(x: number, y: number, width: number, height: number) {
  const middleWidth = Math.floor(width / 2);
  const middleHeight = Math.floor(height / 2);

  if (x >= 0 && x < middleWidth && y >= 0 && y < middleHeight) {
    return 0;
  }
  if (x >= middleWidth + 1 && x < width && y >= 0 && y < middleHeight) {
    return 1;
  }
  if (x >= 0 && x < middleWidth && y >= middleHeight + 1 && y < height) {
    return 2;
  }
  if (x >= middleWidth + 1 && x < width && y >= middleHeight + 1 && y < height) {
    return 3;
  }

  return -1;
}

function calcRobotFinishPosition(robot: Robot, width: number, height: number, time: number) {
  const sumX = robot.x + robot.velocity.x * time;
  const sumY = robot.y + robot.velocity.y * time;

  const nextX = sumX % width;
  const nextY = sumY % height;

  return {
    x: nextX < 0 ? width + nextX : nextX,
    y: nextY < 0 ? height + nextY : nextY,
  };
}

function solvePart1(robots: Robot[]) {
  const result: number[] = [0, 0, 0, 0];
  const width = 101;
  const height = 103;

  for (const robot of robots) {
    const { x, y } = calcRobotFinishPosition(robot, width, height, 100);
    const quadrant = getQuadrant(x, y, width, height);

    if (quadrant !== -1) {
      result[quadrant] += 1;
    }
  }

  return result[0] * result[1] * result[2] * result[3];
}

function hasLongDiagonal(robotPositions: Set<string>, width: number, height: number) {
  for (const robotPosStr of robotPositions) {
    if (getDiagonalSize(robotPositions, robotPosStr, width, height) > 10) {
      return true;
    }
  }

  return false;
}

function getDiagonalSize(
  robotPositions: Set<string>,
  robotPosStr: string,
  width: number,
  height: number,
): number {
  if (!robotPositions.has(robotPosStr)) {
    return 0;
  }
  const [i, j] = JSON.parse(robotPosStr);
  const [nextI, nextJ] = [(i + 1) % width, (j - 1) % height];

  return (
    1 +
    getDiagonalSize(
      robotPositions,
      JSON.stringify([nextI < 0 ? width + nextI : nextI, nextJ < 0 ? height + nextJ : nextJ]),
      width,
      height,
    )
  );
}

function printOutput(robots: Set<string>, I: number, J: number, k: number) {
  let result = `K=${k}\n`;

  for (let j = 0; j < J; j++) {
    for (let i = 0; i < I; i++) {
      if (robots.has(JSON.stringify([i, j]))) {
        result += '#';
      } else {
        result += '.';
      }
    }
    result += '\n';
  }

  appendFile(outputPath, result);
}

function solvePart2(robots: Robot[]) {
  const width = 101;
  const height = 103;

  let robotsCopy = robots.slice();

  for (let i = 0; i < 10000; i++) {
    const result: Set<string> = new Set();
    const nextRobots: Robot[] = [];

    for (const robot of robotsCopy) {
      const { x, y } = calcRobotFinishPosition(robot, width, height, 1);
      nextRobots.push({ x, y, velocity: robot.velocity });
      result.add(JSON.stringify([x, y]));
    }

    if (hasLongDiagonal(result, width, height)) {
      printOutput(result, width, height, i);

      return i;
    }

    robotsCopy = nextRobots;
  }

  return -1;
}

export async function main() {
  const input = parseInput(await readFile(inputPath));

  await writeFile(outputPath, '');

  const { val: part1, time: time1 } = executeWithTiming(solvePart1, input);
  const { val: part2, time: time2 } = executeWithTiming(solvePart2, input);

  return {
    part1,
    time1,
    part2,
    time2,
  };
}
