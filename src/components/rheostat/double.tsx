import React, { useMemo } from 'react';
import { View } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { DOT_DEFAULT_COLOR, DOT_DEFAULT_RADIUS } from './constant';
import type { BaseRheostatProps } from './types';
import { getPosition, getValue } from './utils';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { SkiaDot } from '../skiaDot/skiaDot';

function DoubleRheostat({
  enabled = true,
  width,
  height,
  values: inputValues,
  data,
  onValuesUpdated,
  horizontalPadding = DOT_DEFAULT_RADIUS,
  ...props
}: BaseRheostatProps) {
  const drawingWidth = useMemo(
    () => width - 2 * horizontalPadding,
    [horizontalPadding, width]
  );

  /**
   * DOT 1
   */
  const dot1ValuePosition = useSharedValue(
    getPosition(inputValues[0] as number, data, drawingWidth)
  );
  const dot1DataValue = useDerivedValue(() => {
    return getValue(dot1ValuePosition.value, data, drawingWidth);
  });

  /**
   * DOT 2
   */
  const dot2ValuePosition = useSharedValue(
    getPosition(inputValues[1] as number, data, drawingWidth)
  );
  const dot2DataValue = useDerivedValue(() => {
    return getValue(dot2ValuePosition.value, data, drawingWidth);
  });

  const activeDataValues = useDerivedValue(() => {
    return data.filter(
      (d) => d >= dot1DataValue.value && d <= dot2DataValue.value
    );
  });

  const path = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(0, height / 2);
    p.lineTo(drawingWidth, height / 2);

    return p;
  }, [drawingWidth, height]);
  const activePath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.moveTo(dot1ValuePosition.value, height / 2);
    p.lineTo(dot2ValuePosition.value, height / 2);

    return p;
  }, [dot1ValuePosition.value, dot2ValuePosition.value, height]);

  const isGestureActive = useSharedValue<number | undefined>(undefined);
  const gesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(enabled)
    .onTouchesDown((event) => {
      const touch = event.changedTouches[0]?.x;
      if (touch) {
        const distance1 = Math.abs(touch - dot1ValuePosition.value);
        const distance2 = Math.abs(touch - dot2ValuePosition.value);

        if (distance1 < 30 && distance2 < 30) {
          if (distance1 < distance2) {
            isGestureActive.value = 0;
          } else {
            isGestureActive.value = 1;
          }

          return;
        } else {
          if (distance1 < 30) {
            isGestureActive.value = 0;
          } else if (distance2 < 30) {
            isGestureActive.value = 1;
          }
        }
      }
    })
    .onTouchesUp(() => (isGestureActive.value = undefined))
    .onChange((event) => {
      if (drawingWidth === undefined) return;
      if (isGestureActive.value === undefined) return;

      if (onValuesUpdated) {
        onValuesUpdated({
          activeValues: activeDataValues.value,
          max: Math.max(...activeDataValues.value),
          min: Math.min(...activeDataValues.value),
        });
      }

      if (isGestureActive.value === 0) {
        if (
          event.x <= Math.min(dot2ValuePosition.value - 30, drawingWidth) &&
          event.x >= 0
        ) {
          dot1ValuePosition.value = event.x;
        }
      } else if (isGestureActive.value === 1) {
        if (
          event.x >= Math.max(0, dot1ValuePosition.value + 30) &&
          event.x <= drawingWidth
        ) {
          dot2ValuePosition.value = event.x;
        }
      }
    });

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
}

export default DoubleRheostat;
