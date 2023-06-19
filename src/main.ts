import { UIState, VisualizerConfigState, createState } from "./state";
import { Visualizer } from "./visualizer";
import { Engine } from "./visualizer";
import { appWindow } from "@tauri-apps/api/window";
import { Event as TauriEvent } from "@tauri-apps/api/event";
import { getVisualizerConfigFromUI, uiUpdatedHandler } from "./ui/UI";
import { setupUIEvents } from "./ui/events";

window.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  let canvas: HTMLCanvasElement | null = document.querySelector("#canvas");

  // Visualizer Engine

  let engine: Engine = new Engine({
    canvas: canvas!,
    experience: Visualizer,
  });

  // State

  const visualizerState: VisualizerConfigState =
    createState<VisualizerConfigState>(
      engine,
      engine.configUpdated,
      getVisualizerConfigFromUI()
    );

  const uiState: UIState = createState<UIState>(this, uiUpdatedHandler, {
    isMidiLoading: false,
  });

  // UI Events
  setupUIEvents(visualizerState, uiState);

  // Tauri events
  appWindow.listen(
    "midi-file-pick-canceled",
    (event: TauriEvent<unknown>) => {
      console.log(
        "Frontend got message that the file pick was canceled",
        event
      );
      uiState.isMidiLoading = false;
    }
  );

  appWindow.listen(
    "midi-file-processed",
    (event: TauriEvent<unknown>) => {
      console.log("Frontend got message with processed midi data", event);
      uiState.isMidiLoading = false;
    }
  );
});
