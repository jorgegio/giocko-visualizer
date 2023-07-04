import { MidiFile } from "midifile-ts";

export type State = {
  backgroundColor: string;
  cameraRotation: {
    x: number;
    y: number;
  };
  midi: MidiFile;
  isMidiLoading: boolean;
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
    midi: {
      header: { formatType: 0, ticksPerBeat: 0, trackCount: 0 },
      tracks: [],
    },
    isMidiLoading: false,
  };
}

class Store {
  public state: State;
  private subscribers: Array<
    (state: Readonly<State>, previousState?: Readonly<State>) => void
  >;

  constructor() {
    this.state = defaultState();
    this.subscribers = [];
    
    this.state = new Proxy(defaultState(), {
      set: (state, key, value) => {
        const previous: State = structuredClone(state);
        Reflect.set(state, key, value);

        this.subscribers.forEach((subscriber) => subscriber(state, previous));

        return true;
      },
    });
  }

  public subscribe(
    fn: (state: Readonly<State>, previousState?: Readonly<State>) => void
  ): void {
    this.subscribers.push(fn);
  }
}

export const store = new Store();
