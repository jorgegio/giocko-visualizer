export type VisualizerConfigState = {
  backgroundColor: string;
};

export type UIState = {
  isMidiLoading: boolean;
};

type State = VisualizerConfigState | UIState;

export function createState<T extends State>(
  context: unknown,
  updateHandler: (state: Readonly<T>, previousState: Readonly<T>) => void,
  defaultValue: T
): T {
  const target: T = structuredClone(defaultValue);

  return new Proxy(target, {
    set(target, key, value) {
      const previous: T = structuredClone(target);
      Reflect.set(target, key, value);
      updateHandler.call(context, target, previous);

      return true;
    },
  });
}
