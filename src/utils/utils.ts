export function didValueChange<T>(
  config: Readonly<T>,
  previousState: Readonly<T> | null | undefined,
  key: keyof T
) {
  return !previousState || config[key] !== previousState[key];
}
