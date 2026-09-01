import { Container, Graphics } from "pixi.js";
import { gameScreen } from "../../game-config";
import { getDistance } from "@utils/basic-geometry";
import { getGlobalWorldCoordinates } from "../../main";

const centerX = gameScreen.width / 2;
const centerY = gameScreen.height / 2;

export class Compass extends Container {
  graphics = new Graphics();

  constructor(
    public abcX: number,
    public abcY: number,
    public condition: Function,
  ) {
    super();
    this.graphics.eventMode = "none";
  }

  private draw(x: number, y: number) {
    const dx = x - centerX;
    const dy = y - centerY;

    const angle = Math.atan2(dy, dx);

    const radius = 250;

    const arrowX = centerX + Math.cos(angle) * radius;
    const arrowY = centerY + Math.sin(angle) * radius;

    this.graphics.position.set(arrowX, arrowY);

    this.graphics.rotation = angle;

    this.graphics
      .moveTo(20, 0)
      .lineTo(-10, -10)
      .lineTo(-10, 10)
      .closePath()
      .stroke({ width: 4, color: "#000000" })
      .fill("#00ff00");
  }

  public updateCompassPosition() {
    const { x, y } = getGlobalWorldCoordinates(this.abcX, this.abcY);

    if (getDistance(x, y, centerX, centerY) > 300) {
      this.draw(x, y);
    } else {
      this.graphics.clear();
    }
  }
}
