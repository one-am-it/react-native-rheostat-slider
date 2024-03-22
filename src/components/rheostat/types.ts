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

export type HandlersState = {
  min?: number;
  max?: number;
  activeValues: number[];
};

export interface RheostatProps {
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /**
   * @description
   * current slider values.
   * La proprietà definisce i valori iniziali dei DOT
   */
  values: number[];
  /**
   * @description
   * valori da mappare sullo slider
   */
  data: number[];
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
  onValuesUpdated?: (state:HandlersState) => void,
}
