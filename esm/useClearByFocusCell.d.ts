import {GestureResponderEvent, LayoutChangeEvent} from 'react-native';
interface Options {
  setValue(text: string): void;
  value?: string;
}
type HookResult = [
  {
    onPressOut: (event: GestureResponderEvent) => void;
  },
  (index: number) => (event: LayoutChangeEvent) => void,
];
export declare const useClearByFocusCell: (options: Options) => HookResult;
export {};
