import { Resource } from "@resources/resource";

export class Arrow extends Resource {
  protected draw() {
    this.graphic
      .moveTo(0, -5)
      .lineTo(5, 4)
      .lineTo(0, 2)
      .lineTo(-5, 4)
      .closePath()
      .stroke({ width: 2, color: "#000000" })
      .fill("#d1c953");
  }
}
