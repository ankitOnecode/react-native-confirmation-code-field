import { useEffect, useMemo, useRef } from 'react';
import { Platform } from 'react-native';
const findIndex = ({locationX, locationY}, map) => {
  for (const [index, {x, y, xEnd, yEnd}] of Object.entries(map)) {
    if (
      x < locationX &&
      locationX < xEnd &&
      y < locationY &&
      locationY < yEnd
    ) {
      return parseInt(index, 10);
    }
  }
  return -1;
};
export const useClearByFocusCell = (options) => {
  const valueRef = useRef(options);
  const cellsLayouts = useRef({});
  const otpInputLength = Object.keys(cellsLayouts.current).length;
  valueRef.current = options;
  const {setValue} = valueRef.current;
  useEffect(() => {
    if (options && options?.value && options?.value?.length > otpInputLength) {
      setValue(
        options.value.length > otpInputLength
          ? options.value
              .replace(' ', options.value[options.value.length - 1])
              .slice(0, otpInputLength)
          : options.value,
      );
    }
  }, [options.value]);
  const clearCodeByCoords = (coords) => {
    const index = findIndex(coords, cellsLayouts.current);
    if (index !== -1) {
      const {value, setValue} = valueRef.current;
      if (value.includes(' ')) return
      let text =
        value && value?.length > 0
          ? value?.substring(0, index) + ' ' + value?.substring(index + 1)
          : (value || '')?.slice(0, index);
      text = text.length >= otpInputLength && text[otpInputLength - 1] === ' ' ? text.substring(0, otpInputLength - 1) : text
      setValue(text);
    }
  };
  const getCellOnLayoutHandler = (index) => (event) => {
    const {width, height, x, y} = event.nativeEvent.layout;
    cellsLayouts.current[`${index}`] = {
      x,
      xEnd: x + width,
      y,
      yEnd: y + height,
    };
  };
  const onPressOut = (event) => clearCodeByCoords(event.nativeEvent);
  // For support react-native-web
  const onClick = (event) => {
    // @ts-expect-error: not types for getClientRects
    const [offset] = event.target.getClientRects();
    const locationX = event.clientX - offset.left;
    const locationY = event.clientY - offset.top;
    clearCodeByCoords({locationX, locationY});
  };
  return [
    // @ts-expect-error: for web support
    useMemo(() => Platform.select({web: {onClick}, default: {onPressOut}}), []),
    getCellOnLayoutHandler,
  ];
};
