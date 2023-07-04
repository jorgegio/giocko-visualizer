import { store } from "../store/state";
import { read } from "midifile-ts";

// Adds event listeners to UI elements
export function setupUIEvents() {
  const state = store.state;
  // Load MIDI
  document.querySelector("#midi-input")?.addEventListener("change", (e) => {
    e.preventDefault();
    console.log("loading midi");
    const fileList = (e.target as HTMLInputElement).files;

    if (fileList?.length) {
      const file = fileList[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target == null) {
          return;
        }

        try {
          const buf = e.target.result as ArrayBuffer;
          const midi = read(buf);
          console.log("midi", midi);
          state.midi = midi;
        } catch {
          console.log("Failed to read file");
        }
      };

      reader.readAsArrayBuffer(file);
    }
  });

  // Background Color

  const colorInputEl: HTMLInputElement | null =
    document.querySelector("#color-input");

  colorInputEl?.addEventListener("change", (e) => {
    e.preventDefault();
    state.backgroundColor = colorInputEl.value;
  });

  // Camera Rotation

  const cameraRotationXEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-x");
  const cameraRotationXValueEl: HTMLInputElement | null =
    document.querySelector("#camera-rotation-x-value");

  cameraRotationXEl?.addEventListener("change", (e) => {
    e.preventDefault();
    state.cameraRotation = {
      ...state.cameraRotation,
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
    state.cameraRotation = {
      ...state.cameraRotation,
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
    state.cameraRotation = {
      ...state.cameraRotation,
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
    state.cameraRotation = {
      ...state.cameraRotation,
      y: 0,
    };

    if (cameraRotationYValueEl) {
      cameraRotationYValueEl.textContent = "0";
    }
  });
}
