import Animated from 'react-native-reanimated';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { DotProps } from './types';

export function Dot({ color, size, style }: DotProps) {
  const styles = useMemo(() => makeStyle(color, size), [color, size]);

  return <Animated.View style={[styles.circle, style]} />;
}

const makeStyle = (color: string, size: number) =>
  StyleSheet.create({
    circle: {
      height: size,
      width: size,
      backgroundColor: color,
      borderRadius: 500,
      zIndex: 100,
      position: 'absolute',
    },
  });
