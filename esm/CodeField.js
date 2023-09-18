import React, { forwardRef } from 'react';
import { TextInput, View } from 'react-native';
import { styles } from './CodeField.styles';
import { useFocusState } from './useFocusState';
import { getStyle, getSymbols } from './utils';
const DEFAULT_CELL_COUNT = 4;
function CodeFieldComponent(
  {
    rootStyle,
    textInputStyle,
    onBlur,
    onFocus,
    value,
    renderCell,
    cellCount = DEFAULT_CELL_COUNT,
    RootProps = {},
    RootComponent = View,
    InputComponent = TextInput,
    ...rest
  },
  ref,
) {
  const focusState = useFocusState(onBlur, onFocus);
  const cells = getSymbols(value || '', cellCount).map(
    (symbol, index, symbols) => {
      const isFirstEmptySymbol = symbols.indexOf('') === index;
      return renderCell({
        index,
        symbol,
        isFocused: focusState.isFocused && isFirstEmptySymbol,
      });
    },
  );
  return React.createElement(
    RootComponent,
    {...RootProps, style: getStyle(styles.root, rootStyle)},
    cells,
    React.createElement(InputComponent, {
      disableFullscreenUI: true,
      // Use `caretHidden={false}` when `value={''}` and user can't paste\copy text because menu doesn't appear
      // See more: https://github.com/retyui/react-native-confirmation-code-field/issues/140
      caretHidden: true,
      spellCheck: false,
      autoCorrect: false,
      blurOnSubmit: false,
      clearButtonMode: 'never',
      autoCapitalize: 'characters',
      underlineColorAndroid: 'transparent',
      maxLength: cellCount + 1,
      ...rest,
      value: value,
      onBlur: focusState.onBlur,
      onFocus: focusState.onFocus,
      style: getStyle(styles.textInput, textInputStyle),
      ref: ref,
    }),
  );
}
export const CodeField = forwardRef(CodeFieldComponent);
