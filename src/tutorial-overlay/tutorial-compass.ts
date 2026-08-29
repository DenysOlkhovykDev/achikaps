import { getDistance } from "@utils/basic-geometry";
import { Graphics, Container } from "pixi.js";
import { gameScreen } from "../game-config";

export interface Compass {
  condition: Function;

  findTarget: Function;
}

export class TutorialCompass extends Container {
  private graphics = new Graphics();

  constructor() {
    super();

    this.addChild(this.graphics);

    this.eventMode = "none";
  }

  update(targetX?: number, targetY?: number) {
    this.graphics.clear();

    if (targetX === undefined || targetY === undefined) {
      return;
    }

    const centerX = gameScreen.width / 2;
    const centerY = gameScreen.height / 2;

    if (getDistance(targetX, targetY, centerX, centerY) > 300) {
      const dx = targetX - centerX;
      const dy = targetY - centerY;

      const angle = Math.atan2(dy, dx);

      const radius = 250;

      const arrowX = centerX + Math.cos(angle) * radius;
      const arrowY = centerY + Math.sin(angle) * radius;

      this.position.set(arrowX, arrowY);

      this.graphics.rotation = angle;

      this.graphics.moveTo(20, 0);
      this.graphics.lineTo(-10, -10);
      this.graphics.lineTo(-10, 10);
      this.graphics.closePath();

      this.graphics.fill("#00ff00");
    }
  }
}
