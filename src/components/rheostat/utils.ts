export function getPosition(
  value: number,
  data: number[],
  minRange: number,
  maxRange: number
): number {
  'worklet';

  const min = Math.min(...data);
  const max = Math.max(...data);

  return (maxRange - minRange) * ((value - min) / (max - min)) + minRange;
}

export function getValue(
  pos: number,
  data: number[],
  minRange: number,
  maxRange: number
): number {
  'worklet';

  const min = Math.min(...data);
  const max = Math.max(...data);

  return Math.round(((pos - minRange) / (maxRange - minRange)) * (max - min) + min);
}
