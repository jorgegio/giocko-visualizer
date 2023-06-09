import { VisualizerConfigState } from "./state";
import { Visualizer } from "./visualizer";
import { Engine } from "./visualizer";

// DOM Elements

let colorInputEl: HTMLInputElement | null;
let canvas: HTMLCanvasElement | null;

// State

const state: VisualizerConfigState = new Proxy(
  {
    backgroundColor: "#000000",
  },
  {
    set(
      target: VisualizerConfigState,
      key: keyof typeof target,
      value: (typeof target)[typeof key]
    ) {
      target[key] = value;
      engine?.configUpdated(state);

      return true;
    },
  }
);

// Engine

let engine: Engine | null;

window.addEventListener("DOMContentLoaded", () => {
  // UI
  colorInputEl = document.querySelector("#color-input");
  canvas = document.querySelector("#canvas");

  colorInputEl?.addEventListener("change", (e) => {
    e.preventDefault();
    if (colorInputEl) {
      state.backgroundColor = colorInputEl.value;
    }
  });

  // Visualizer
  engine = new Engine({
    canvas: canvas!,
    experience: Visualizer,
  });
  engine.configUpdated(state);
});
