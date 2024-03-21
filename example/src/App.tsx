import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Rheostat } from 'oneam-react-native-rheostat';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const mockValues = Array.from<number>(new Array(29)).map((_, index) => index);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.canvas}>
        <Rheostat
          double={false}
          values={mockValues}
          style={{ paddingHorizontal: 20 }}
          theme={{
            dot: '#6388f0',
            slider: { inactive: '#bec3c0', active: '#6388f0' },
          }}
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
