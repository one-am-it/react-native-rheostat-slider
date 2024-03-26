import React, { useCallback } from 'react';
import { Circle, Group } from '@shopify/react-native-skia';
import {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { DotProps } from '../dot/types';

interface SkiaDotProps extends DotProps {
  circleX: SharedValue<number>;
  circleY: number;
  active: SharedValue<number | undefined>;
  index?: number;
}

export function SkiaDot({
  active: sharedActive,
  size,
  color,
  circleX,
  circleY,
  index,
}: SkiaDotProps) {
  const dotSize = useSharedValue(size);
  const insideDot = useDerivedValue(() => dotSize.value - 4);

  const setIsActive = useCallback(
    (active: boolean) => {
      dotSize.value = withSpring(active ? size + 2 : size, {
        mass: 1,
        stiffness: 1000,
        damping: 50,
        velocity: 0,
      });
    },
    [dotSize, size]
  );

  useAnimatedReaction(
    () => sharedActive && sharedActive.value === index,
    (active) => {
      runOnJS(setIsActive)(active);
    },
    [sharedActive, setIsActive]
  );

  return (
    <Group>
      <Circle cx={circleX} cy={circleY} r={dotSize} color={color}></Circle>
      <Circle cx={circleX} cy={circleY} r={insideDot} color={'white'}></Circle>
    </Group>
  );
}
