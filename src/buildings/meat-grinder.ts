import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class MeatGrinder extends Building {
  numberOfBlades: number = 4;
  rotationSpeed: number = 0.05;

  blades: Graphics[] = [];

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
  }

  draw() {
    this.drawBlades();

    this.makeBasicCircle(this.baseSize, "#d2aa8a", true);
    this.makeRoundShadow(this.baseSize);

    for (let i = 0; i < this.numberOfBlades; i++) {
      this.visual.addChild(this.blades[i]);
    }
    this.visual.addChild(this.mainGraphic);

    this.drawBladeConnectors();

    this.makeBasicCircle(this.baseSize - 12, "#846c5b", false);
    this.makeBasicCircle(this.baseSize - 14, "#ce9e81", false);
  }

  private drawBlades() {
    for (let i = 0; i < this.numberOfBlades; i++) {
      const blade = new Graphics();

      const { x: x1, y: y1 } = this.getRadialPoint(
        i,
        this.numberOfBlades,
        this.baseSize + 4,
      );

      blade.position.set(x1, y1);

      blade.moveTo(0, 0).lineTo(0, -8).lineTo(2, -6).lineTo(4, 0).closePath();
      blade.moveTo(0, 0).lineTo(-8, 0).lineTo(-6, -2).lineTo(0, -4).closePath();
      blade.moveTo(0, 0).lineTo(8, 0).lineTo(6, 2).lineTo(0, 4).closePath();
      blade.moveTo(0, 0).lineTo(0, 8).lineTo(-2, 6).lineTo(-4, 0).closePath();

      blade.stroke({ width: 1, color: "#000000", cap: "round" });
      blade.fill("#000000");

      this.blades.push(blade);
    }
  }

  private drawBladeConnectors() {
    for (let i = 0; i < this.numberOfBlades; i++) {
      const { x: x1, y: y1 } = this.getRadialPoint(
        i,
        this.numberOfBlades,
        this.baseSize - 14,
      );

      const { x: x2, y: y2 } = this.getRadialPoint(
        i,
        this.numberOfBlades,
        this.baseSize + 2,
      );

      this.mainGraphic.moveTo(x1, y1).lineTo(x2, y2);
    }
    this.mainGraphic.stroke({ width: 8, color: "#bd8e67", cap: "round" });
  }

  animation(delta: number) {
    for (let i = 0; i < this.numberOfBlades; i++) {
      this.blades[i].rotation += this.rotationSpeed * delta;
    }
  }
}
