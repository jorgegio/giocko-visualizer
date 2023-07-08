import { setupConfigUIEvents } from "./config-events";
import { fileInputEvents } from "./file-input-events";

// Adds event listeners to UI elements
export function setupUIEvents() {
  setupConfigUIEvents();
  fileInputEvents();
}
