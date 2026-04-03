import { Graphics } from "pixi.js";

export abstract class Resource {
  graphic: Graphics;

  constructor(
    public x = 0,
    public y = 0,
  ) {
    this.graphic = new Graphics();
    this.draw();
    this.graphic.x = this.x;
    this.graphic.y = this.y;
  }

  protected abstract draw(): void;
}
