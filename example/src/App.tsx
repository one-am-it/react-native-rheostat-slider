import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Rheostat } from 'oneam-react-native-rheostat';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const mockValues = Array.from<number>(new Array(28)).map((_, index) => index);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.canvas}>
        <Rheostat
          double={true}
          values={[22, 22]}
          data={mockValues}
          style={{ paddingHorizontal: 20 }}
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
