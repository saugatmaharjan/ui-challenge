const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
export const range = (
  inputRange: number[],
  outputRange: number[],
  value: number
) =>
  lerp(
    outputRange[0],
    outputRange[1],
    invlerp(inputRange[0], inputRange[1], value)
  );
