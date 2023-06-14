import { invoke } from "@tauri-apps/api/tauri";
import { UIState, VisualizerConfigState } from "../state";

// Adds event listeners to UI elements
export function setupUIEvents(
  visualizerState: VisualizerConfigState,
  uiState: UIState
) {
  // Load MIDI
  document.querySelector("#midi-input")?.addEventListener("click", (e) => {
    e.preventDefault();
    invoke("load_midi");
    uiState.isMidiLoading = true;
  });

  // Background Color

  const colorInputEl: HTMLInputElement | null =
    document.querySelector("#color-input");

  colorInputEl?.addEventListener("change", (e) => {
    e.preventDefault();
    visualizerState.backgroundColor = colorInputEl.value;
  });

  // Camera Rotation

  const cameraRotationXEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-x");
  const cameraRotationXValueEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-x-value");

  cameraRotationXEl?.addEventListener("change", (e) => {
    e.preventDefault();
    visualizerState.cameraRotation = {
      ...visualizerState.cameraRotation,
      x: parseFloat(cameraRotationXEl.value),
    };

    if (cameraRotationXValueEl) {
      cameraRotationXValueEl.textContent = cameraRotationXEl.value;
    }
  });

  // reset on double click
  cameraRotationXEl?.addEventListener("dblclick", (e) => {
    e.preventDefault();
    cameraRotationXEl.value = "0";
    visualizerState.cameraRotation = {
      ...visualizerState.cameraRotation,
      x: 0,
    };

    if (cameraRotationXValueEl) {
      cameraRotationXValueEl.textContent = "0";
    }
  });

  const cameraRotationYEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-y");
  const cameraRotationYValueEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-y-value");

  cameraRotationYEl?.addEventListener("change", (e) => {
    e.preventDefault();
    visualizerState.cameraRotation = {
      ...visualizerState.cameraRotation,
      y: parseFloat(cameraRotationYEl.value),
    };

    if (cameraRotationYValueEl) {
      cameraRotationYValueEl.textContent = cameraRotationYEl.value;
    }
  });

  // reset on double click
  cameraRotationYEl?.addEventListener("dblclick", (e) => {
    e.preventDefault();
    cameraRotationYEl.value = "0";
    visualizerState.cameraRotation = {
      ...visualizerState.cameraRotation,
      y: 0,
    };

    if (cameraRotationYValueEl) {
      cameraRotationYValueEl.textContent = "0";
    }
  });

  const cameraRotationZEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-z");
  const cameraRotationZValueEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-z-value");

  cameraRotationZEl?.addEventListener("change", (e) => {
    e.preventDefault();
    visualizerState.cameraRotation = {
      ...visualizerState.cameraRotation,
      z: parseFloat(cameraRotationZEl.value),
    };

    if (cameraRotationZValueEl) {
      cameraRotationZValueEl.textContent = cameraRotationZEl.value;
    }
  });

  cameraRotationZEl?.addEventListener("dblclick", (e) => {
    e.preventDefault();
    cameraRotationZEl.value = "0";
    visualizerState.cameraRotation = {
      ...visualizerState.cameraRotation,
      z: 0,
    };

    if (cameraRotationZValueEl) {
      cameraRotationZValueEl.textContent = "0";
    }
  });
}
