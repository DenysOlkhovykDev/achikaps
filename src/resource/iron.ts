import { Resource } from "./resource";

export class Iron extends Resource {
  protected draw() {
    this.graphic
      .rect(-5, -5, 10, 10)
      .stroke({ width: 2, color: "#000000" })
      .fill("#5bd5d3");
  }
}
