import { Container, Graphics } from "pixi.js";
import { gameScreen } from "../../game-config";

export class ConstructionButton extends Container {
  graphic = new Graphics();

  public buttonPosition = {
    x: gameScreen.width / 2,
    y: gameScreen.height - gameScreen.height / 20,
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
