import { fs } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { read } from "midifile-ts";
import { store } from "../../store/state";
import { Object3D } from "three";

// Adds event listeners to UI elements
export function fileInputEvents() {
  const state = store.state;

  // Load MIDI
  document
    .querySelector("#midi-input")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();

      const file = await open({
        multiple: false,
        filters: [
          {
            name: "MIDI",
            extensions: ["mid"],
          },
        ],
      });

      if (typeof file !== "string") {
        return;
      }

      try {
        const buf = await fs.readBinaryFile(file);
        const midi = read(buf);
        console.log("midi", midi);
        state.midi = {
          ...midi,
          tracksConfig: midi.tracks.map((_, index) => ({
            color: "#ffffff",
            depth: index,
            name: `Track ${index}`,
          })),
          renderedNotes: Array<Object3D<Event>[]>(midi.tracks.length).fill([]),
        };
      } catch (e) {
        console.log("Failed to read file", e);
        // TODO: Show error toast/banner
      }
    });

  // Load audio

  document
    .querySelector("#audio-input")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();

      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Audio",
            extensions: ["mp3", "wav", "ogg"],
          },
        ],
      });

      if (typeof selected === "string") {
        console.log("selected", convertFileSrc(selected));

        const audioElement = <HTMLAudioElement>document.querySelector("#audio");
        audioElement.src = convertFileSrc(selected);
        audioElement.controls = true;
      }
    });
}

// midiInputEl?.addEventListener("change", (e) => {
//   e.preventDefault();
//   console.log("loading midi");
//   const fileList = (e.target as HTMLInputElement).files;

//   if (fileList?.length) {
//     const file = fileList[0];

//     // List of accepted file types, gotten from your input's accept property.
//     const acceptedFileTypes = midiInputEl.accept
//       .split(",")
//       .map((item) => item.trim());

//     // Check if file has the correct type.
//     if (!isValidFileType(file, acceptedFileTypes)) {
//       console.log(
//         `Invalid file type, expected ${acceptedFileTypes}, got: ${file.type}`
//       );
//       midiInputEl.value = "";
//       state.midi = {
//         header: { formatType: 0, ticksPerBeat: 0, trackCount: 0 },
//         tracks: [],
//         tracksConfig: [],
//         renderedNotes: [],
//       };

//       // TODO: Show error toast/banner

//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = (e) => {
//       if (e.target == null) {
//         return;
//       }

//       try {
//         const buf = e.target.result as ArrayBuffer;
//         const midi = read(buf);
//         console.log("midi", midi);
//         state.midi = {
//           ...midi,
//           tracksConfig: midi.tracks.map((_, index) => ({
//             color: "#ffffff",
//             depth: index,
//             name: `Track ${index}`,
//           })),
//           renderedNotes: Array<Object3D<Event>[]>(midi.tracks.length).fill(
//             []
//           ),
//         };
//       } catch (e) {
//         console.log("Failed to read file", e);
//         midiInputEl.value = "";
//         state.midi = {
//           header: { formatType: 0, ticksPerBeat: 0, trackCount: 0 },
//           tracks: [],
//           tracksConfig: [],
//           renderedNotes: [],
//         };
//         // TODO: Show error toast/banner
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   }
// });
