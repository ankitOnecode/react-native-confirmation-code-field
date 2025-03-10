import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewProps,
} from 'react-native';
import {
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  ReactElement,
  ReactNode,
  RefAttributes,
} from 'react';
export interface RenderCellOptions {
  symbol: string;
  index: number;
  isFocused: boolean;
}
type OmitStyle<
  T extends {
    style?: any;
  },
> = Omit<T, 'style'>;
interface BaseProps {
  renderCell: (options: RenderCellOptions) => ReactNode;
  RootProps?: ViewProps;
  RootComponent?: ComponentType<ViewProps>;
  rootStyle?: ViewProps['style'];
  textInputStyle?: StyleProp<TextStyle>;
  cellCount?: number;
}
export interface Props
  extends BaseProps,
    OmitStyle<TextInputProps>,
    RefAttributes<TextInput> {}
export interface CodeFieldOverridableComponent {
  <C extends ElementType>(
    props: {
      InputComponent: C;
    } & OmitStyle<ComponentPropsWithRef<C>> &
      BaseProps,
  ): ReactElement;
  (props: Props): ReactElement;
}
export declare const CodeField: CodeFieldOverridableComponent;
export {};
