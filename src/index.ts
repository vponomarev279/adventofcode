import { main as day1 } from './2024/01-12';
import { main as day2 } from './2024/02-12';
import { main as day3 } from './2024/03-12';
import { main as day4 } from './2024/04-12';
import { main as day5 } from './2024/05-12';
import { main as day6 } from './2024/06-12';
import { main as day7 } from './2024/07-12';
import { solve } from './lib/solver.lib';

(async () => {
  await solve('Day 1', day1);
  await solve('Day 2', day2);
  await solve('Day 3', day3);
  await solve('Day 4', day4);
  await solve('Day 5', day5);
  await solve('Day 6', day6);
  await solve('Day 7', day7);
})();
