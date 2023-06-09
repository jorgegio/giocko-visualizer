import { Entity } from "./Entity";
import { Engine } from "./Engine";

export type ExperienceConstructor = new (engine: Engine) => Experience;
export interface Experience extends Entity {
  init(): void;
}
