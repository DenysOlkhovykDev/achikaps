import { Container, Graphics } from "pixi.js";
import { pauseManager } from "./manager";

export class PauseButton extends Container {
  private symbol = new Graphics();
  private background = new Graphics();

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();

    this.updateSymbol();
  }

  private createBackground() {
    this.background.rect(20, 20, 30, 40).fill({ color: "#e5ecea" });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    this.addChild(this.background);
  }

  private createSymbol() {
    this.symbol.eventMode = "static";

    this.symbol.on("pointerdown", (e) => {
      e.stopPropagation();
      this.togglePause();
    });

    this.addChild(this.symbol);
  }

  private togglePause() {
    pauseManager.toggle();
    this.updateSymbol();
  }

  private updateSymbol() {
    if (pauseManager.isPaused()) {
      this.drawStopSymbol();
    } else {
      this.drawPlaySymbol();
    }
  }

  private drawPlaySymbol() {
    this.symbol.clear();

    this.symbol
      .moveTo(20, 20)
      .lineTo(50, 40)
      .lineTo(20, 60)
      .closePath()
      .fill({ color: "#000000" });
  }

  private drawStopSymbol() {
    this.symbol.clear();

    this.symbol
      .moveTo(20, 20)
      .lineTo(20, 60)
      .moveTo(50, 20)
      .lineTo(50, 60)
      .stroke({
        width: 10,
        color: "#000000",
      });
  }
}

export const pauseButton = new PauseButton();
