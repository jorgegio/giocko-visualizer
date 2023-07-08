import { MidiFile } from "midifile-ts";

type TrackConfig = {
  depth: number;
  color: string;
  name: string;
};

export type State = {
  backgroundColor: string;
  cameraRotation: {
    x: number;
    y: number;
  };
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  midi: MidiFile & {
    tracksConfig: TrackConfig[];
    renderedNotes: THREE.Object3D<THREE.Event>[][];
  };
};

function defaultState(): State {
  const colorInputEl: HTMLInputElement | null =
    document.querySelector("#color-input");

  return {
    backgroundColor: colorInputEl?.value ?? "#000000",
    cameraRotation: {
      x: 0,
      y: 0,
    },
    cameraPosition: {
      x: 0,
      y: 2,
      z: 10,
    },
    midi: {
      header: { formatType: 0, ticksPerBeat: 0, trackCount: 0 },
      tracks: [],
      tracksConfig: [],
      renderedNotes: [],
    },
  };
}

class Store {
  public state: State;
  private subscribers: Array<{
    fn: (state: Readonly<State>) => void;
    keys: Array<keyof State>;
  }>;

  constructor() {
    this.state = defaultState();
    this.subscribers = [];

    this.state = new Proxy(defaultState(), {
      set: (state, key, value) => {
        Reflect.set(state, key, value);
        this.subscribers.forEach(({ fn, keys }) => {
          if (keys.includes(key as keyof State)) {
            fn(state);
          }
        });

        return true;
      },
    });
  }

  public subscribe(
    fn: (state: Readonly<State>, previousState?: Readonly<State>) => void,
    keys: Array<keyof State>
  ): void {
    this.subscribers.push({ keys, fn });
  }
}

export const store = new Store();
