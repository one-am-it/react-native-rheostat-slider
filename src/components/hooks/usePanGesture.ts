import { type SharedValue, useSharedValue } from 'react-native-reanimated';
import { Gesture, type PanGesture } from 'react-native-gesture-handler';
import { useMemo } from 'react';

interface Config {
  enabled: boolean;
}

interface Result {
  isActive: SharedValue<boolean>;
  gesture: PanGesture;
}

export function usePanGesture({ enabled }: Config): Result {
  const isPanGestureActive = useSharedValue(false);

  /**
   * la gesture viene gestita dal thread js
   * https://reactnative.dev/architecture/threading-model
   */
  const panGesture = useMemo(() => {
    // console.log(_WORKLET);

    return Gesture.Pan()
      .runOnJS(true)
      .enabled(enabled)
      .onStart(() => {
        isPanGestureActive.value = true;
      })
      .onEnd(() => {
        isPanGestureActive.value = false;
      });
  }, [enabled, isPanGestureActive]);

  return useMemo(
    () => ({
      gesture: panGesture,
      isActive: isPanGestureActive,
    }),
    [isPanGestureActive, panGesture]
  );
}
