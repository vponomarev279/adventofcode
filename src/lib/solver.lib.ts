type Solver = {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  part1: any;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  part2: any;
  time1: string;
  time2: string;
};

export async function solve(title: string, solver: () => Promise<Solver>) {
  console.group(title);
  const { part1, part2, time1, time2 } = await solver();

  console.table({
    'Part 1': `${part1} (${time1})`,
    'Part 2': `${part2} (${time2})`,
  });

  console.groupEnd();
}
