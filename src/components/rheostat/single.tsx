import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import type { BaseRheostatProps } from './types';
import { Dot } from '../dot';
import { usePanGesture } from '../hooks/usePanGesture';
import { getPosition, getValue } from './utils';
import { DOT_DEFAULT_COLOR, DOT_DEFAULT_RADIUS } from './constant';

function SingleRheostat({
  enabled = true,
  width,
  values: inputValues,
  data,
  onValuesUpdated,
  ...props
}: BaseRheostatProps) {
  const axisWidth = useMemo(() => width - DOT_DEFAULT_RADIUS, [width]);

  const dotValuePosition = useSharedValue(
    getPosition(inputValues[0] as number, data, axisWidth)
  );

  const dataValue = useDerivedValue(() => {
    return getValue(dotValuePosition.value, data, axisWidth);
  });
  const activeDataValues = useDerivedValue(() => {
    return data.filter((d) => d <= dataValue.value);
  });

  const { gesture } = usePanGesture({ enabled });
  gesture.onChange((event) => {
    if (event.absoluteX <= axisWidth) {
      if (onValuesUpdated) {
        onValuesUpdated({
          activeValues: activeDataValues.value,
          max: Math.max(...activeDataValues.value),
          min: Math.min(...activeDataValues.value),
        });
      }
      dotValuePosition.value = event.absoluteX;
    }
  });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: dotValuePosition.value }],
  }));
  const sliderWidth = useAnimatedStyle(() => ({
    width: dotValuePosition.value,
  }));

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Dot
          color={props.theme?.dot ?? DOT_DEFAULT_COLOR}
          size={DOT_DEFAULT_RADIUS}
          style={animatedStyles}
        />
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
    top: DOT_DEFAULT_RADIUS / 2,
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
