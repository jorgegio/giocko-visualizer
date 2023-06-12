import { UIState, VisualizerConfigState, createState } from "./state";
import { Visualizer } from "./visualizer";
import { Engine } from "./visualizer";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { Event as TauriEvent } from "@tauri-apps/api/event";

function uiUpdatedHandler(
  state: Readonly<UIState>,
  previousState: Readonly<UIState>
) {
  if (previousState.isMidiLoading !== state.isMidiLoading) {
    console.log("midi loading state changed", state.isMidiLoading);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Tauri events
  appWindow.listen(
    "midi-file-pick-canceled",
    (event: TauriEvent<{ message: string }>) => {
      console.log(
        "Frontend got message that the file pick was canceled",
        event
      );
      uiState.isMidiLoading = false;
    }
  );

  appWindow.listen(
    "midi-file-processed",
    (event: TauriEvent<{ message: string }>) => {
      console.log("Frontend got message with processed midi data", event);
      uiState.isMidiLoading = false;
    }
  );

  // DOM Elements
  let canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
  let colorInputEl: HTMLInputElement | null =
    document.querySelector("#color-input");

  // Visualizer Engine

  let engine: Engine = new Engine({
    canvas: canvas!,
    experience: Visualizer,
  });

  // State

  const visualizerState: VisualizerConfigState =
    createState<VisualizerConfigState>(engine, engine.configUpdated, {
      backgroundColor: "#000000",
    });

  const uiState: UIState = createState<UIState>(this, uiUpdatedHandler, {
    isMidiLoading: false,
  });

  // const uiState: UIState = createUIState({
  //   isMidiLoading: false,
  // });

  // UI Event Listeners

  document.querySelector("#midi-input")?.addEventListener("click", (e) => {
    e.preventDefault();
    invoke("load_midi");
    uiState.isMidiLoading = true;
  });

  colorInputEl?.addEventListener("change", (e) => {
    e.preventDefault();
    if (colorInputEl) {
      visualizerState.backgroundColor = colorInputEl.value;
    }
  });
});
