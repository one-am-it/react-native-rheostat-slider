import * as React from 'react';
import { Rheostat } from '@one-am/react-native-rheostat-slider';

export default function App() {
  return (
    <Rheostat
      values={[-1, 300001]}
      min={-1}
      max={300001}
      theme={{
        dot: '#6388f0',
        slider: { inactive: '#bec3c0', active: '#6388f0' },
      }}
      step={1000}
      onValuesUpdated={(state) => console.log(state)}
    />
  );
}
