import React, { useCallback, useMemo, useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';

import type { RheostatProps } from './types';
import SingleRheostat from './single';
import DoubleRheostat from './double';

type RheostatImplProps = RheostatProps & {
  double?: boolean;
};

function RheostatImpl({ double = false, values, ...props }: RheostatImplProps) {
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

  return (
    <View style={[{ height: '100%' }, props.style]} onLayout={onLayout}>
      {layout.width > 0 ? (
        double ? (
          <DoubleRheostat
            height={layout.height}
            width={layout.width}
            values={checkedValues}
            {...props}
          />
        ) : (
          <SingleRheostat
            height={layout.height}
            width={layout.width}
            values={checkedValues}
            {...props}
          />
        )
      ) : null}
    </View>
  );
}

export const Rheostat = React.memo(RheostatImpl);
