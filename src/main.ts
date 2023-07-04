import "./store/state";
import "./ui/UI";
import { Engine, Visualizer } from "./visualizer";
import { setupUIEvents } from "./ui/events";

window.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  let canvas: HTMLCanvasElement = document.querySelector("#canvas")!;

  // Visualizer Engine
  new Engine({ canvas: canvas, experience: Visualizer });

  // UI Events
  setupUIEvents();
});
