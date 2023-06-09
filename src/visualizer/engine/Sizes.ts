import { Engine } from "./Engine";

type Sizing = "contain" | "video";

export class Sizes {
  public width!: number;
  public height!: number;
  public pixelRatio: number = Math.min(window.devicePixelRatio, 2);
  public aspectRatio!: number;

  public sizing: Sizing = "contain";

  constructor(private engine: Engine) {
    this.resize();

    window.addEventListener("resize", () => {
      this.resize();
      this.engine.resize();
    });
  }

  public setContainsSizing() {
    this.width = this.engine.canvas.clientWidth;
    this.height = this.engine.canvas.clientHeight;

    this.setAspectRatio(this.width / this.height);
  }

  public setVideoSizing() {
    this.width = 1920;
    this.height = 1080;
    this.setAspectRatio(1920 / 1080);
  }

  setAspectRatio(aspectRatio: number) {
    this.aspectRatio = aspectRatio;
  }

  setSizing(sizing: Sizing) {
    this.sizing = sizing;

    this.resize();
  }

  resize() {
    switch (this.sizing) {
      case "contain": {
        this.setContainsSizing();
        break;
      }
      case "video": {
        this.setVideoSizing();
        break;
      }
    }
  }
}
