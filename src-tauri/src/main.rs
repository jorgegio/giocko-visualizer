// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{api::dialog, Window};
mod midi;
use midi::process_midi;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn load_midi(window: Window) {
    dialog::FileDialogBuilder::default()
        .add_filter("MIDI", &["mid"])
        .pick_file(move |file_pick_result| {
            // Do something
            match file_pick_result {
                Some(file_path) => process_midi(&window, file_path.as_path()),
                None => window
                    .emit(
                        "midi-file-pick-canceled",
                        Payload {
                            message: "No MIDI file was selected".into(),
                        },
                    )
                    .unwrap(),
            }
        });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_midi])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
