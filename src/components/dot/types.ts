import type { StyleProp, ViewStyle } from 'react-native';

export interface DotProps {
  color: string;
  size: number;
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
}
