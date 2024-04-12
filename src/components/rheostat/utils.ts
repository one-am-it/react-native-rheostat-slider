import type { SharedValue } from 'react-native-reanimated';
import { DOT_MAGNETIC_AREA } from './constant';

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

  return Math.round(
    ((pos - minRange) / (maxRange - minRange)) * (max - min) + min
  );
}

export function whichIsActive(touch: number, ...dots: SharedValue<number>[]) {
  if (dots.length === 0) return -1;

  const touchDotsDistance = dots
    .map((d, index) => {
      return { index, distance: Math.abs(d.value - touch) };
    })
    .filter((d) => d.distance <= DOT_MAGNETIC_AREA);

  if (touchDotsDistance.length === 0) return -1;

  const minimumDistanceDot = touchDotsDistance.reduce((state, currentValue) => {
    return state.distance < currentValue.distance ? state : currentValue;
  });

  return minimumDistanceDot.index;
}
