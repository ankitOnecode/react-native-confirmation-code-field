import {MouseEvent, useMemo, useRef, useEffect} from 'react';
import {GestureResponderEvent, LayoutChangeEvent, Platform} from 'react-native';

interface Layout {
  x: number;
  y: number;
  xEnd: number;
  yEnd: number;
}

interface LayoutsMap {
  [cellIndex: string]: Layout;
}

interface Coords {
  locationX: number;
  locationY: number;
}

const findIndex = ({locationX, locationY}: Coords, map: LayoutsMap): number => {
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

interface Options {
  setValue(text: string): void;
  value?: string;
}

type HookResult = [
  {onPressOut: (event: GestureResponderEvent) => void},
  (index: number) => (event: LayoutChangeEvent) => void,
];

export const useClearByFocusCell = (options: Options): HookResult => {
  const valueRef = useRef<Options>(options);
  const cellsLayouts = useRef<LayoutsMap>({});
  const otpInputLength = Object.keys(cellsLayouts.current).length

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

  const clearCodeByCoords = (coords: Coords) => {
    const index = findIndex(coords, cellsLayouts.current);

    if (index !== -1) {
      const {value, setValue} = valueRef.current;
      const text =
        value && value?.length > 0
          ? value?.substring(0, index) + ' ' + value?.substring(index + 1)
          : (value || '')?.slice(0, index);

      setValue(text);
    }
  };

  const getCellOnLayoutHandler =
    (index: number) => (event: LayoutChangeEvent) => {
      const {width, height, x, y} = event.nativeEvent.layout;

      cellsLayouts.current[`${index}`] = {
        x,
        xEnd: x + width,
        y,
        yEnd: y + height,
      };
    };

  const onPressOut = (event: GestureResponderEvent) =>
    clearCodeByCoords(event.nativeEvent);

  // For support react-native-web
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    // @ts-expect-error: not types for getClientRects
    const [offset] = event.target.getClientRects() as [
      {left: number; top: number},
    ];
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
