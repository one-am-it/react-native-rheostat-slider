import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { BaseRheostatProps } from './types';
import { Dot } from '../dot';

const STEP_SIZE = 30;

function SingleRheostat({
  width,
  height,
  values: inputValues,
  ...props
}: BaseRheostatProps) {
  const axisWidth = useMemo(() => width - STEP_SIZE, [width]);

  const xTranslation = useSharedValue(0);
  // const currentSnapValue = useDerivedValue(() => {
  //   if (width === 0) return 0;
  //
  //   const v = (xTranslation.value * inputValues.length) / axisWidth;
  //   return Math.round(v);
  // });

  const pan = Gesture.Pan().onChange((event) => {
    if (event.absoluteX <= axisWidth) xTranslation.value = event.absoluteX;
  });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: xTranslation.value }],
  }));
  const sliderWidth = useAnimatedStyle(() => ({
    width: xTranslation.value,
  }));

  return (
    <>
      <GestureDetector gesture={pan}>
        <Dot color={props.theme?.dot} style={animatedStyles} />
      </GestureDetector>
      <Animated.View
        style={[
          styles.slider,
          styles.active,
          sliderWidth,
          { backgroundColor: props.theme?.slider?.active },
        ]}
      />
      <View
        style={[
          styles.slider,
          styles.inactive,
          { backgroundColor: props.theme?.slider?.inactive },
        ]}
      />
    </>
  );
}

export default SingleRheostat;

const styles = StyleSheet.create({
  slider: {
    position: 'absolute',
    top: STEP_SIZE / 2,
  },
  active: {
    height: 4,
    zIndex: 10,
  },
  inactive: {
    height: 2,
    width: '100%',
  },
});
