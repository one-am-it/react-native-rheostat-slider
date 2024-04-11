import React, { useCallback, useMemo, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';

import type { RheostatProps } from './types';
import SingleRheostat from './single';
import DoubleRheostat from './double';

type RheostatImplProps = Omit<RheostatProps, 'data'> & {
  double?: boolean;
  data?: number[];
};

function RheostatImpl({
  double = false,
  step = 1,
  ...props
}: RheostatImplProps) {
  const { values, max, min, unlimitedUpperBound, unlimitedBottomBound, data } =
    props;

  const [layout, setLayout] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const onLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setLayout({
        height: Math.round(layout.height),
        width: Math.round(layout.width),
      });
    },
    []
  );

  const checkedValues = useMemo(() => {
    try {
      if (double) {
        if (values.length < 2) {
          throw new Error('È necessario definire due valori');
        } else if (values.length > 2) {
          return values.slice(0, 2);
        }
      } else {
        if (values.length === 0) {
          throw new Error('È necessario definire un valore');
        } else if (values.length > 1) {
          return values.slice(0, 1);
        }
      }

      return values;
    } catch (error) {
      console.warn(error);
      return [];
    }
  }, [double, values]);

  const snapPoints = useMemo(() => {
    const points =
      data ??
      Array.from(
        { length: Math.floor((max - min) / step) + 1 },
        (_, i) => min + i * step
      );
    return (
      data ??
      ([
        unlimitedBottomBound ? min - 1 : null,
        ...points,
        unlimitedUpperBound ? max + 1 : null,
      ].filter((p) => p !== null) as number[])
    );
  }, [data, max, min, step, unlimitedBottomBound, unlimitedUpperBound]);

  return (
    <View style={[{ height: '100%' }, props.style]} onLayout={onLayout}>
      {layout.width > 0 ? (
        double ? (
          <DoubleRheostat
            {...props}
            height={layout.height}
            width={layout.width}
            values={checkedValues}
            data={snapPoints}
          />
        ) : (
          <SingleRheostat
            {...props}
            height={layout.height}
            width={layout.width}
            values={checkedValues}
            data={snapPoints}
          />
        )
      ) : null}
    </View>
  );
}

export const Rheostat = React.memo(RheostatImpl);
