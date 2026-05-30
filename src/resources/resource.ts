import { Graphics } from "pixi.js";

export abstract class Resource {
  graphic: Graphics;
  isReserved: boolean;

  constructor(public resourceType: string) {
    this.graphic = new Graphics();
    this.draw();
    this.graphic.x = 0;
    this.graphic.y = 0;
    this.isReserved = false;
  }

  protected abstract draw(): void;
}
