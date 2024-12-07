function msToTime(ms: number) {
  const seconds = ms / 1000;
  const minutes = ms / (1000 * 60);

  if (ms < 1000) {
    return ms.toFixed(2) + ' ms';
  }

  if (seconds < 60) {
    return seconds.toFixed(2) + ' s';
  }

  return minutes.toFixed(2) + ' min';
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function executeWithTiming(fn: (...args: any) => number, ...args: any[]) {
  const start = performance.now();
  const val = fn(...args);
  const end = performance.now();

  return {
    val,
    time: msToTime(end - start),
  };
}
