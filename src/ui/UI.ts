import { UIState, VisualizerConfigState } from "../state";
import { didValueChange } from "../utils";

export function uiUpdatedHandler(
  state: Readonly<UIState>,
  previousState?: Readonly<UIState>
) {
  if (didValueChange(state, previousState, "isMidiLoading")) {
    console.log("midi loading state changed", state.isMidiLoading);
  }
}

export function getVisualizerConfigFromUI(): VisualizerConfigState {
  const colorInputEl: HTMLInputElement | null =
    document.querySelector("#color-input");

  return {
    backgroundColor: colorInputEl?.value ?? "#000000",
    cameraRotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  };
}
