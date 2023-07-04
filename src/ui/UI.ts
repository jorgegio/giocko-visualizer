import { State, store } from "../store/state";
import { didValueChange } from "../store/utils";

function uiUpdatedHandler(
  state: Readonly<State>,
  previousState?: Readonly<State>
) {
  if (didValueChange(state, previousState, "isMidiLoading")) {
    console.log("midi loading state changed", state.isMidiLoading);
  }
  if (didValueChange(state, previousState, "midi") && state.midi) {
    generateTracks();
  }
}

store.subscribe(uiUpdatedHandler);

function generateTracks() {
  const { midi } = store.state;

  const tracksContainer = document.querySelector("#tracks-container")!;

  for (let track = 0; track < midi.tracks.length; track++) {
    const node = document.createElement("track-config");
    node.innerHTML = `track ${track}`;
    tracksContainer.appendChild(node);
  }
}
