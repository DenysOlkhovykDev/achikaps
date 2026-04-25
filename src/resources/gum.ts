import { Resource } from "@resources/resource";

export class Gum extends Resource {
  protected draw() {
    this.graphic
      .circle(-3, 0, 2)
      .circle(3, 0, 2)
      .rect(-2, -1, 4, 2)
      .stroke({ width: 2, color: "#000000" })
      .fill("#da315b");
  }
}
