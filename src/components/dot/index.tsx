import Animated from 'react-native-reanimated';
import React, { useMemo } from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

const DOT_DEFAULT_SIZE = 30;
const DOT_DEFAULT_COLOR = 'violet';

interface DotProps {
  color?: string;
  size?: number;
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Dot({
  color = DOT_DEFAULT_COLOR,
  size = DOT_DEFAULT_SIZE,
  style,
}: DotProps) {
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
