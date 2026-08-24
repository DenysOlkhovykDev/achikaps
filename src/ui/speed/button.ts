import { Container, Graphics } from "pixi.js";
import { speedManager } from "./manager";

class SpeedButton extends Container {
  private symbol = new Graphics();
  private background = new Graphics();

  constructor() {
    super();

    this.createBackground();
    this.createSymbol();

    this.updateSymbol();
  }

  private createBackground(): void {
    this.background.rect(60, 20, 30, 40).fill({ color: "#e5ecea" });

    this.background.eventMode = "static";

    this.background.on("pointerdown", (e) => {
      e.stopPropagation();
      this.toggleSpeed();
    });

    this.addChild(this.background);
  }

  private createSymbol(): void {
    this.symbol.eventMode = "static";

    this.symbol.on("pointerdown", (e) => {
      e.stopPropagation();
      this.toggleSpeed();
    });

    this.addChild(this.symbol);
  }

  private toggleSpeed(): void {
    speedManager.toggle();
    this.updateSymbol();
  }

  private updateSymbol(): void {
    if (speedManager.getSpeed() === 1) {
      this.drawStandartSymbol();
    } else {
      this.drawDoubleSymbol();
    }
  }

  private drawStandartSymbol(): void {
    this.symbol.clear();

    this.symbol
      .moveTo(60, 20)
      .lineTo(90, 40)
      .lineTo(60, 60)
      .closePath()
      .moveTo(70, 20)
      .lineTo(100, 40)
      .lineTo(70, 60)
      .fill({ color: "#000000" });
  }

  private drawDoubleSymbol(): void {
    this.symbol.clear();

    this.symbol
      .moveTo(60, 20)
      .lineTo(90, 40)
      .lineTo(60, 60)
      .closePath()
      .moveTo(70, 20)
      .lineTo(100, 40)
      .lineTo(70, 60)
      .fill({ color: "#ff0000" });
  }
}

export const speedButton = new SpeedButton();
