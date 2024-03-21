import React, { useCallback, useState } from 'react';
import type { Layout, RheostatProps } from './types';
import SingleRheostat from './single';
import DoubleRheostat from './double';
import { type LayoutChangeEvent, View } from 'react-native';

type RheostatImplProps = RheostatProps &
  Partial<Layout> & {
    double: boolean;
  };

function RheostatImpl(props: RheostatImplProps) {
  const [layout, setLayout] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const onLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setLayout({
        height: props.height ? props.height : Math.round(layout.height),
        width: props.width ? props.width : Math.round(layout.width),
      });
    },
    []
  );

  return (
    <View style={props.style}>
      <View
        style={{
          position: 'relative',
          height: '100%',
        }}
        onLayout={onLayout}
      >
        {props.double ? (
          <DoubleRheostat
            height={layout.height}
            width={layout.width}
            {...props}
          />
        ) : (
          <SingleRheostat
            height={layout.height}
            width={layout.width}
            {...props}
          />
        )}
      </View>
    </View>
  );
}

export const Rheostat = React.memo(RheostatImpl);
