import { Container } from "pixi.js";
import { Tutorial } from "./tutorial";

export class Tutorials extends Container {
  tutorials: Tutorial[] = [];

  i = 0;
  public addTutorial(
    text: string,
    showCondition: Function,
    hideCondition: Function,
    needOkButton: boolean,
    x?: number,
    y?: number,
    findTarget?: Function,
  ) {
    const tutorial = new Tutorial(
      text,
      showCondition,
      hideCondition,
      needOkButton,
      x,
      y,
      findTarget,
    );
    this.tutorials.push(tutorial);
    this.addChild(tutorial);
  }

  public updateTutorials() {
    if (this.tutorials.length > 0) {
      this.tutorials[this.i].updateTutorial();
      if (!this.tutorials[this.i].isActive) {
        if (this.i < this.tutorials.length - 1) {
          this.i++;
        }
      }
    }
  }
}

export const tutorials: Tutorials = new Tutorials();
