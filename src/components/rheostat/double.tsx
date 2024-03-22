import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { Dot } from '../dot';
import { DOT_DEFAULT_COLOR, DOT_DEFAULT_SIZE } from './constant';
import type { BaseRheostatProps } from './types';
import { usePanGesture } from '../hooks/usePanGesture';
import { getPosition, getValue } from './utils';

function DoubleRheostat({
  enabled = true,
  width,
  values: inputValues,
  data,
  onValuesUpdated,
  ...props
}: BaseRheostatProps) {
  const { gesture: x1Pan } = usePanGesture({ enabled });
  const { gesture: x2Pan } = usePanGesture({ enabled });
  const axisWidth = useMemo(() => width - DOT_DEFAULT_SIZE, [width]);

  /**
   * DOT 1
   */
  const dot1ValuePosition = useSharedValue(
    getPosition(inputValues[0] as number, data, axisWidth)
  );
  const dot1DataValue = useDerivedValue(() => {
    return getValue(dot1ValuePosition.value, data, axisWidth);
  });

  /**
   * DOT 2
   */
  const dot2ValuePosition = useSharedValue(
    getPosition(inputValues[1] as number, data, axisWidth)
  );
  const dot2DataValue = useDerivedValue(() => {
    return getValue(dot2ValuePosition.value, data, axisWidth);
  });

  const activeDataValues = useDerivedValue(() => {
    return data.filter(
      (d) => d >= dot1DataValue.value && d <= dot2DataValue.value
    );
  });

  x1Pan.onChange((event) => {
    if (event.absoluteX <= dot2ValuePosition.value) {
      if (onValuesUpdated) {
        onValuesUpdated({
          activeValues: activeDataValues.value,
          max: Math.max(...activeDataValues.value),
          min: Math.min(...activeDataValues.value),
        });
      }
      dot1ValuePosition.value = event.absoluteX;
    }
  });
  x2Pan.onChange((event) => {
    if (
      event.absoluteX >= dot1ValuePosition.value &&
      event.absoluteX <= axisWidth
    ) {
      if (onValuesUpdated) {
        onValuesUpdated({
          activeValues: activeDataValues.value,
          max: Math.max(...activeDataValues.value),
          min: Math.min(...activeDataValues.value),
        });
      }
      dot2ValuePosition.value = event.absoluteX;
    }
  });

  const x1AnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: dot1ValuePosition.value }],
  }));
  const x2AnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: dot2ValuePosition.value }],
  }));

  const sliderWidth = useAnimatedStyle(() => ({
    width: dot2ValuePosition.value - dot1ValuePosition.value,
    left: dot1ValuePosition.value,
  }));

  return (
    <>
      <GestureDetector gesture={x1Pan}>
        <Dot
          color={props.theme?.dot ?? DOT_DEFAULT_COLOR}
          size={DOT_DEFAULT_SIZE}
          style={x1AnimatedStyles}
        />
      </GestureDetector>
      <GestureDetector gesture={x2Pan}>
        <Dot
          color={props.theme?.dot ?? DOT_DEFAULT_COLOR}
          size={DOT_DEFAULT_SIZE}
          style={x2AnimatedStyles}
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

export default DoubleRheostat;

const styles = StyleSheet.create({
  slider: {
    position: 'absolute',
    top: DOT_DEFAULT_SIZE / 2,
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
