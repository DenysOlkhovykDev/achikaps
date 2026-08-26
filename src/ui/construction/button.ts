import { Container, Graphics } from "pixi.js";

export class ConstructionButton extends Container {
  graphic = new Graphics();

  private buttonPosition = {
    x: 500,
    y: 950,
  };

  constructor() {
    super();

    this.graphic = new Graphics()
      .moveTo(this.buttonPosition.x - 25, this.buttonPosition.y)
      .lineTo(this.buttonPosition.x + 25, this.buttonPosition.y)
      .moveTo(this.buttonPosition.x, this.buttonPosition.y - 25)
      .lineTo(this.buttonPosition.x, this.buttonPosition.y + 25)
      .stroke({ width: 16, color: "#00ff60" });

    this.addChild(this.graphic);
  }
}
