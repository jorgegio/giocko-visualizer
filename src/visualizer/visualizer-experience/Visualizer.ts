import { Engine } from "../engine/Engine";
import * as THREE from "three";
import { Experience } from "../engine/Experience";
import { store } from "../../store/state";
import { Box } from "./elements/Box";

export class Visualizer implements Experience {
  constructor(private engine: Engine) {}

  init() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;

    // this.engine.scene.add(plane);
    this.engine.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 2, 2);

    this.engine.scene.add(directionalLight);

    store.subscribe((state) => {
      if (state.midi) {
        // Clean existing notes
        this.engine.scene.remove(...this.engine.scene.children);

        for (let index = 0; index < state.midi.tracks.length; index++) {
          let displacementX = 0;
          for (let event of state.midi.tracks[index]) {
            displacementX += event.deltaTime / 1000;

            if (event.type === "channel" && event.subtype === "noteOn") {
              const displacementY = event.noteNumber / 5;
              const note = new Box(state.midi.tracksConfig[index].color);
              note.castShadow = false;

              note.position.set(
                displacementX,
                displacementY - 10,
                -state.midi.tracksConfig[index].depth * 3
              );

              state.midi.renderedNotes[index].push(note);
              // console.log(`adding note at ${displacementX}, ${displacementY}`);
            }
          }
          if (state.midi.renderedNotes[index].length) {
            this.engine.scene.add(...state.midi.renderedNotes[index]);
          }
        }
      }
    });
  }

  resize() {}

  update() {}
}
