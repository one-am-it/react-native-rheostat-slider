import React, { useCallback, useMemo } from 'react';

import {
  Gesture,
  GestureDetector,
  type GestureTouchEvent,
} from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

import type { BaseRheostatProps } from './types';
import { getPosition, getValue, whichIsActive } from './utils';
import { DOT_DEFAULT_COLOR, DOT_DEFAULT_RADIUS } from './constant';
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { SkiaDot } from '../skiaDot/skiaDot';

function SingleRheostat({
  enabled = true,
  horizontalPadding = DOT_DEFAULT_RADIUS,
  ...props
}: BaseRheostatProps) {
  const { width, values: inputValues, height, data, onValuesUpdated } = props;
  const startX = useMemo(() => horizontalPadding, [horizontalPadding]);
  const endX = useMemo(
    () => width - horizontalPadding,
    [horizontalPadding, width]
  );
  const path = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(startX, height / 2);
    p.lineTo(endX, height / 2);

    return p;
  }, [endX, height, startX]);

  const dotValuePosition = useSharedValue(
    getPosition(inputValues[0] as number, data, startX, endX)
  );

  const dataValue = useDerivedValue(() => {
    return getValue(dotValuePosition.value, data, startX, endX);
  });
  const activeDataValues = useDerivedValue(() => {
    return data.filter((d) => d <= dataValue.value);
  });

  const activePath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.moveTo(startX, height / 2);
    p.lineTo(dotValuePosition.value, height / 2);

    return p;
  }, [startX, horizontalPadding, dotValuePosition, height]);

  const isGestureActive = useSharedValue<number>(-1);
  const trackTouchDown = useCallback(
    (event: GestureTouchEvent) => {
      const touch = event.changedTouches[0]?.x;

      if (touch) {
        isGestureActive.value = whichIsActive(touch, dotValuePosition);
      }
    },
    [dotValuePosition, isGestureActive]
  );
  const trackTouchUp = useCallback(
    () => (isGestureActive.value = -1),
    [isGestureActive]
  );
  const gesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(enabled)
    .onTouchesDown(trackTouchDown)
    .onTouchesUp(trackTouchUp)
    .onChange((event) => {
      if (isGestureActive.value === undefined) return;

      if (onValuesUpdated) {
        onValuesUpdated({
          activeValues: activeDataValues.value,
          max: Math.max(...activeDataValues.value),
          min: Math.min(...activeDataValues.value),
        });
      }

      if (isGestureActive.value === 0) {
        if (event.x <= endX && event.x >= startX) {
          dotValuePosition.value = event.x;
        }
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas
        style={{
          flex: 1,
        }}
      >
        <Group>
          <Path
            path={path}
            strokeWidth={3}
            color={props.theme?.slider?.inactive}
            style="stroke"
            strokeJoin="round"
            strokeCap="round"
          ></Path>
          <Path
            path={activePath}
            strokeWidth={3}
            color={props.theme?.slider?.active}
            style="stroke"
            strokeJoin="round"
            strokeCap="round"
          ></Path>
        </Group>
        <SkiaDot
          color={props.theme?.dot ?? DOT_DEFAULT_COLOR}
          size={DOT_DEFAULT_RADIUS}
          circleX={dotValuePosition}
          active={isGestureActive}
          circleY={height / 2}
          index={0}
        />
      </Canvas>
    </GestureDetector>
  );
}

export default SingleRheostat;
