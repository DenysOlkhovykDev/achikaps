import { Resource } from "./resource";

export class Perl extends Resource {
  protected draw() {
    this.graphic
      .circle(0, 0, 5)
      .stroke({ width: 2, color: "#000000" })
      .fill("#49c461");
  }
}
