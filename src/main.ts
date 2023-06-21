import { UIState, VisualizerConfigState, createState } from "./utils/state";
import { Visualizer } from "./visualizer";
import { Engine } from "./visualizer";
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
});
