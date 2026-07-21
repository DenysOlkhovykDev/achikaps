import { Resource } from "@resources/resource";

const leftSide = -6;
const rightSide = 6;
const topSide = -4;
const bottomSide = 4;
const leftJoin = -3;
const rightJoin = 3;

export class Truss extends Resource {
  protected draw() {
    this.graphic
      .moveTo(rightSide, topSide)
      .lineTo(rightJoin, bottomSide)
      .lineTo(leftJoin, topSide)
      .lineTo(leftSide, bottomSide)
      .stroke({ width: 1.5, color: "#000000" });

    this.graphic
      .moveTo(leftSide - 1, topSide)
      .lineTo(rightSide + 1, topSide)
      .stroke({ width: 4, color: "#000000" });

    this.graphic
      .moveTo(leftSide, topSide)
      .lineTo(rightSide, topSide)
      .stroke({ width: 2, color: "#d1b453" });

    this.graphic
      .moveTo(leftSide - 1, bottomSide)
      .lineTo(rightSide + 1, bottomSide)
      .stroke({ width: 4, color: "#000000" });

    this.graphic
      .moveTo(leftSide, bottomSide)
      .lineTo(rightSide, bottomSide)
      .stroke({ width: 2, color: "#d1b453" });
  }
}
