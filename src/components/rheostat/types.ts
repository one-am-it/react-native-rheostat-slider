import type { StyleProp, ViewStyle } from 'react-native';

export type BaseRheostatProps = RheostatProps & Layout;

export interface Layout {
  /**
   * @description
   * container width
   */
  width: number;
  /**
   * @description
   * container height
   */
  height: number;
}

export interface RheostatProps {
  min?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
  values: number[];
  /**
   * @description
   * Personalizzazione componenti
   */
  theme?: {
    dot?: string;
    slider?: {
      active?: string;
      inactive?: string;
    };
  };
}
