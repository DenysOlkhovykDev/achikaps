import { Container } from "pixi.js";
import { Compass } from "./compass";

export class Compasses extends Container {
  compasses: Compass[] = [];

  public addCompass(x: number, y: number, condition: Function) {
    const compass = new Compass(x, y, condition);
    this.compasses.push(compass);
    this.addChild(compass.graphics);
  }

  public updateCompasses() {
    for (let i = 0; i < this.compasses.length; i++) {
      const result = this.compasses[i].condition();
      this.compasses[i].visible = result;

      if (result) {
        this.compasses[i].updateCompassPosition();
      }
    }
  }
}

export const compasses: Compasses = new Compasses();
