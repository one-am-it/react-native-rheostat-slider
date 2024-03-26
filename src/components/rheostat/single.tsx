import React, { useMemo } from 'react';
import { View } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';

import type { BaseRheostatProps } from './types';
import { getPosition, getValue } from './utils';
import { DOT_DEFAULT_COLOR, DOT_DEFAULT_RADIUS } from './constant';
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { SkiaDot } from '../skiaDot/skiaDot';

function SingleRheostat({
  enabled = true,
  width,
  values: inputValues,
  height,
  data,
  onValuesUpdated,
  horizontalPadding = DOT_DEFAULT_RADIUS,
  ...props
}: BaseRheostatProps) {
  const drawingWidth = useMemo(
    () => width - 2 * horizontalPadding,
    [horizontalPadding, width]
  );

  const dotValuePosition = useSharedValue(
    getPosition(inputValues[0] as number, data, drawingWidth)
  );

  const dataValue = useDerivedValue(() => {
    return getValue(dotValuePosition.value, data, drawingWidth);
  });
  const activeDataValues = useDerivedValue(() => {
    return data.filter((d) => d <= dataValue.value);
  });

  const path = useMemo(() => {
    const p = Skia.Path.Make();
    p.moveTo(0, height / 2);
    p.lineTo(drawingWidth, height / 2);

    return p;
  }, [drawingWidth, height]);
  const activePath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.moveTo(0, height / 2);
    p.lineTo(dotValuePosition.value, height / 2);

    return p;
  }, [horizontalPadding, dotValuePosition, height]);

  const isGestureActive = useSharedValue<number | undefined>(undefined);
  const gesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(enabled)
    .onTouchesDown((event) => {
      const touch = event.changedTouches[0]?.x;

      if (touch) {
        const distance = Math.abs(touch - dotValuePosition.value);

        if (distance < 30) {
          isGestureActive.value = 0;
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
        // console.log(event);
        if (event.x <= drawingWidth && event.x >= 0) {
          dotValuePosition.value = event.x;
        }
      }
    });

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            flex: 1,
            backgroundColor: 'green',
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
    </View>
  );
}

export default SingleRheostat;
