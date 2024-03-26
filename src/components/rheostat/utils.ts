export function getPosition(value: number, data: number[], w: number): number {
  'worklet';

  const min = Math.min(...data);
  const max = Math.max(...data);

  return ((value - min) / (max - min)) * w;
}

export function getValue(pos: number, data: number[], w: number): number {
  'worklet';

  const min = Math.min(...data);
  const max = Math.max(...data);

  const decimal = pos / w;

  return Math.round((max - min) * decimal + min);
}
