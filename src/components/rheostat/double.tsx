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

function DoubleRheostat({
  values: inputValues,
  width,
  ...props
}: BaseRheostatProps) {
  const axisWidth = useMemo(() => width - STEP_SIZE, [width]);

  const x1Translation = useSharedValue(0);
  const x2Translation = useSharedValue(100);

  const x1Pan = Gesture.Pan().onChange((event) => {
    if (event.absoluteX <= x2Translation.value) {
      x1Translation.value = event.absoluteX;
    }
  });
  const x2Pan = Gesture.Pan().onChange((event) => {
    if (
      event.absoluteX >= x1Translation.value &&
      event.absoluteX <= axisWidth
    ) {
      x2Translation.value = event.absoluteX;
    }
  });

  const x1AnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: x1Translation.value }],
  }));
  const x2AnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: x2Translation.value }],
  }));

  const sliderWidth = useAnimatedStyle(() => ({
    width: x2Translation.value - x1Translation.value,
    left: x1Translation.value,
  }));

  // const activeValues = useDerivedValue(() => {
  //   if (width === 0) return 0;
  //
  //   return {
  //     start: Math.round((x1Translation.value * inputValues.length) / axisWidth),
  //     end: Math.round((x2Translation.value * inputValues.length) / axisWidth),
  //   };
  // });

  return (
    <>
      <GestureDetector gesture={x1Pan}>
        <Dot color={props.theme?.dot} style={x1AnimatedStyles} />
      </GestureDetector>
      <GestureDetector gesture={x2Pan}>
        <Dot color={props.theme?.dot} style={x2AnimatedStyles} />
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

export default DoubleRheostat;

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
