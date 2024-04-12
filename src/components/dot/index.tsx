import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { DotProps } from './types';

export function Dot({ color, size, style, isActive }: DotProps) {
  const styles = useMemo(() => makeStyle(color), [color]);

  const dotSize = useSharedValue(size);
  const sizeAnimatedValue = useAnimatedStyle(() => ({
    width: dotSize.value,
    height: dotSize.value,
  }));

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
    () => (isActive ? isActive.value : false),
    (active) => {
      runOnJS(setIsActive)(active);
    },
    [isActive, setIsActive]
  );

  return <Animated.View style={[styles.circle, style, sizeAnimatedValue]} />;
}

const makeStyle = (color: string) =>
  StyleSheet.create({
    circle: {
      borderColor: color,
      borderWidth: 3,
      backgroundColor: 'white',
      borderRadius: 500,
      zIndex: 100,
      position: 'absolute',
    },
  });
