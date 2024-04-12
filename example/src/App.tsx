import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Rheostat } from '@one-am/react-native-rheostat-slider';

const mockValues = Array.from<number>(new Array(28)).map((_, index) => index);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.canvas}>
        <Rheostat
          double={true}
          values={[12, 22]}
          data={mockValues}
          min={0}
          max={28}
          step={3}
          horizontalPadding={20}
          unlimitedUpperBound={true}
          theme={{
            dot: '#6388f0',
            slider: { inactive: '#bec3c0', active: '#6388f0' },
          }}
          onValuesUpdated={(state) => console.log(state)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  canvas: {
    width: '100%',
    height: 100,
  },
});
