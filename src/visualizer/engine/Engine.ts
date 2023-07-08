import * as THREE from "three";
import { RenderEngine } from "./RenderEngine";
import { RenderLoop } from "./RenderLoop";
import { Sizes } from "./Sizes";
import { Camera } from "./Camera";
import { Experience, ExperienceConstructor } from "./Experience";
import { State, store } from "../../store/state";

export class Engine {
  public readonly camera!: Camera;
  public readonly scene!: THREE.Scene;
  public readonly renderEngine!: RenderEngine;
  public readonly time!: RenderLoop;
  public readonly sizes!: Sizes;
  public readonly canvas!: HTMLCanvasElement;
  public readonly experience!: Experience;

  constructor({
    canvas,
    experience,
  }: {
    canvas: HTMLCanvasElement;
    experience: ExperienceConstructor;
  }) {
    if (!canvas) {
      throw new Error("No canvas provided");
    }

    this.canvas = canvas;
    this.sizes = new Sizes(this);
    this.time = new RenderLoop(this);
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.renderEngine = new RenderEngine(this);
    this.experience = new experience(this);

    this.experience.init();

    // Subscribe to changes in state
    store.subscribe((state: Readonly<State>) =>
      this.configUpdated(state)
    );
    this.configUpdated(store.state);
  }

  update(delta: number) {
    this.camera.update();
    this.renderEngine.update();
    this.experience.update(delta);
  }

  resize() {
    this.camera.resize();
    this.renderEngine.resize();
    if (this.experience.resize) {
      this.experience.resize();
    }
  }

  configUpdated(config: Readonly<State>) {
    this.renderEngine.setClearColor(config.backgroundColor);
    {
      const { x, y } = config.cameraRotation;
      this.camera.setRotation(x, y, 0);
    }
    {
      const { x, y, z } = config.cameraPosition;
      this.camera.setPosition(x, y, z);
    }
  }
}
