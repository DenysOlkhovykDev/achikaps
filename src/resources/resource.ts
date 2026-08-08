import { Graphics, Texture, Container } from "pixi.js";

export abstract class Resource {
  root: Container;
  isReserved: boolean;
  isReservedForTransport: boolean;
  isReservedForConstruction: boolean;

  static baseTexture: Texture;

  constructor(public resourceType: string) {
    this.root = new Container();
    this.draw();
    this.root.x = 0;
    this.root.y = 0;
    this.isReserved = false;
    this.isReservedForTransport = false;
    this.isReservedForConstruction = false;
  }

  protected abstract draw(): void;
}
