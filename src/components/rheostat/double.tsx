import React, { useCallback, useMemo } from 'react';

import {
  Gesture,
  GestureDetector,
  type GestureTouchEvent,
} from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

import {
  DOT_DEFAULT_COLOR,
  DOT_DEFAULT_RADIUS,
  DOT_MAGNETIC_AREA,
} from './constant';
import type { BaseRheostatProps } from './types';
import { getPosition, getValue, whichIsActive } from './utils';
import { SkiaDot } from '../skiaDot/skiaDot';

function DoubleRheostat({
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

  /**
   * DOT 1
   */
  const dot1ValuePosition = useSharedValue(
    getPosition(inputValues[0] as number, data, startX, endX)
  );
  const dot1DataValue = useDerivedValue(() => {
    return getValue(dot1ValuePosition.value, data, startX, endX);
  });

  /**
   * DOT 2
   */
  const dot2ValuePosition = useSharedValue(
    getPosition(inputValues[1] as number, data, startX, endX)
  );
  const dot2DataValue = useDerivedValue(() => {
    return getValue(dot2ValuePosition.value, data, startX, endX);
  });

  const activeDataValues = useDerivedValue(() => {
    return data.filter(
      (d) => d >= dot1DataValue.value && d <= dot2DataValue.value
    );
  });

  const activePath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.moveTo(dot1ValuePosition.value, height / 2);
    p.lineTo(dot2ValuePosition.value, height / 2);

    return p;
  }, [dot1ValuePosition.value, dot2ValuePosition.value, height]);

  /**
   * -1 = nessuna gesture riconosciuta e gestita
   */
  const isGestureActive = useSharedValue<number>(-1);
  const trackTouchDown = useCallback(
    (event: GestureTouchEvent) => {
      const touch = event.changedTouches[0]?.x;

      if (touch) {
        isGestureActive.value = whichIsActive(
          touch,
          dot1ValuePosition,
          dot2ValuePosition
        );
      }
    },
    [dot1ValuePosition, dot2ValuePosition, isGestureActive]
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
      if (isGestureActive.value === -1) return;

      if (onValuesUpdated) {
        onValuesUpdated({
          activeValues: activeDataValues.value,
          max: Math.max(...activeDataValues.value),
          min: Math.min(...activeDataValues.value),
        });
      }

      if (isGestureActive.value === 0) {
        if (
          event.x <=
            Math.min(dot2ValuePosition.value - DOT_MAGNETIC_AREA, endX) &&
          event.x >= startX
        ) {
          dot1ValuePosition.value = event.x;
        }
      } else if (isGestureActive.value === 1) {
        if (
          event.x >=
            Math.max(startX, dot1ValuePosition.value + DOT_MAGNETIC_AREA) &&
          event.x <= endX
        ) {
          dot2ValuePosition.value = event.x;
        }
      }
    })
    .onEnd(() => {
      if (props.onSliderDragEnd) {
        props.onSliderDragEnd();
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{ flex: 1 }}>
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
        <SkiaDot
          color={props.theme?.dot ?? DOT_DEFAULT_COLOR}
          size={DOT_DEFAULT_RADIUS}
          circleX={dot1ValuePosition}
          active={isGestureActive}
          circleY={height / 2}
          index={0}
        />

        <SkiaDot
          color={props.theme?.dot ?? DOT_DEFAULT_COLOR}
          size={DOT_DEFAULT_RADIUS}
          circleX={dot2ValuePosition}
          circleY={height / 2}
          active={isGestureActive}
          index={1}
        />
      </Canvas>
    </GestureDetector>
  );
}

export default DoubleRheostat;
