import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import {
  generateTextureFromOrigin,
  makeAntennas,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class House extends Building {
  antennasGraphics: Graphics[] = [];
  antennasParams = {
    totalAmount: 3,
    currentAmount: 3,
    angleOffset: Math.PI / 4,
  };

  buildingParams = {
    changeSizeDelay: 300,
    isGrowing: true,
    buildingSize: 1,
  };

  constructor(x: number, y: number) {
    super(x, y, 5, "House");
    this.draw();
  }

  draw() {
    makeRoundShadow(this.baseRadius, "#000000", this.shadowContainer);

    makeAntennas(
      this.contentContainer,
      this.antennasGraphics,
      this.antennasParams.angleOffset,
      this.baseRadius,
      this.antennasParams.totalAmount,
      this.antennasParams.currentAmount,
    );

    this.createBaseTexture();

    const base = new Sprite(House.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (House.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseRadius, "#72ac4a", true);

    makeBasicCircle(baseGraphics, this.baseRadius - 18, "#5b8937", false);

    House.baseTexture = generateTextureFromOrigin(app.renderer, baseGraphics);
  }

  private updateAntennasVisibility() {
    for (let i = 0; i < this.antennasGraphics.length; i++) {
      this.antennasGraphics[i].visible = i < this.antennasParams.currentAmount;
    }
  }

  animation(delta: number) {
    if (this.buildingParams.changeSizeDelay <= 0) {
      const direction = this.buildingParams.isGrowing ? 1 : -1;
      this.buildingParams.buildingSize += 0.01 * delta * direction;
      if (this.buildingParams.buildingSize > 1.1) {
        this.buildingParams.isGrowing = false;
        // this.antennasParams.currentAmount--;
        // this.updateAntennasVisibility();
      }
      if (this.buildingParams.buildingSize <= 1) {
        this.buildingParams.isGrowing = true;
        this.buildingParams.changeSizeDelay = 300;
      }

      this.contentContainer.scale.set(this.buildingParams.buildingSize);
    } else {
      this.buildingParams.changeSizeDelay -= delta;
    }
  }
}
