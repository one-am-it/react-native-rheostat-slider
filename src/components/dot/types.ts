import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export interface DotProps {
  color: string;
  size: number;
  isActive?: SharedValue<boolean>;
  style?: StyleProp<ViewStyle>;
}
