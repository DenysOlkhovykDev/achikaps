import { Graphics, Container } from "pixi.js";
import { Resource } from "@resources/resource";

export class Inventory extends Container {
  storage: Resource | undefined;

  constructor() {
    super();
  }

  public storeResource(resource: Resource) {
    this.storage = resource;

    this.addChild(this.storage.root);

    this.storage.root.x = 0;
    this.storage.root.y = 16;
  }

  public removeResource() {
    if (this.storage) {
      this.removeChild(this.storage.root);
    }
  }
}
