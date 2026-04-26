import { Resource } from "@resources/resource";

export class Gear extends Resource {
  protected draw() {
    const teeth = 6;
    const innerRadius = 4;
    const outerRadius = 6;

    this.graphic.clear();

    const points: number[] = [];

    for (let i = 0; i < teeth; i++) {
      const baseAngle = (i / teeth) * Math.PI * 2;

      const step = (Math.PI * 2) / teeth;

      let angle = baseAngle;
      points.push(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);

      angle = baseAngle + step * 0.3;
      points.push(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);

      angle = baseAngle + step * 0.65;
      points.push(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
    }

    this.graphic
      .poly(points)
      .fill("#89a8b5")
      .stroke({ width: 1, color: "#000000" });

    this.graphic.circle(0, 0, 2).fill("#000000");
  }
}
