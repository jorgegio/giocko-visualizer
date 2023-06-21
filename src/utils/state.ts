import { MidiFile } from "midifile-ts";

export type VisualizerConfigState = {
  backgroundColor: string;
  cameraRotation: {
    x: number;
    y: number;
    z: number;
  };
  midi: MidiFile;
};

export type UIState = {
  isMidiLoading: boolean;
};

type State = VisualizerConfigState | UIState;

export function createState<T extends State>(
  context: unknown,
  updateHandler: (state: Readonly<T>, previousState?: Readonly<T>) => void,
  defaultValue: T
): T {
  const target: T = structuredClone(defaultValue);
  updateHandler.call(context, target);

  return new Proxy(target, {
    set(target, key, value) {
      const previous: T = structuredClone(target);
      Reflect.set(target, key, value);
      updateHandler.call(context, target, previous);

      return true;
    },
  });
}
