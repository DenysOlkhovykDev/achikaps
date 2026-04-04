import { Resource } from "@resources/resource";

export class Meat extends Resource {
  protected draw() {
    this.graphic
      .moveTo(0, -5)
      .lineTo(5, 4)
      .lineTo(-5, 4)
      .lineTo(0, -5)
      .stroke({ width: 2, color: "#000000" })
      .fill("#d15a53");
  }
}
