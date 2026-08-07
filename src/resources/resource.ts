import { Graphics, Texture, Container } from "pixi.js";
import { ResourceType } from "@resources/resource-types";

export abstract class Resource {
  root: Container;
  isReserved: boolean;

  static baseTexture: Texture;

  constructor(public resourceType: ResourceType) {
    this.root = new Container();
    this.draw();
    this.root.x = 0;
    this.root.y = 0;
    this.isReserved = false;
  }

  protected abstract draw(): void;
}
