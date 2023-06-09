export interface Entity {
  update(delta: number): void;
  resize?(): void;
}
