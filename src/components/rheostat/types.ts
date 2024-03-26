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
  /**
   * @description
   * Graph's interactivity enabled. Is possible to pan circles on the line
   */
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
  /**
   * Horizontal padding applied to graph, so the pan gesture dot doesn't get cut off horizontally
   */
  horizontalPadding?: number;
  /**
   * Vertical padding applied to graph, so the pan gesture dot doesn't get cut off vertically
   */
  verticalPadding?: number;
  onValuesUpdated?: (state: HandlersState) => void;
}
