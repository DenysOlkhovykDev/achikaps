import { Graphics, Container } from "pixi.js";

export type Pointer = {
  condition: Function;

  debounce: number;
  timeout: number;

  x?: number;
  y?: number;

  findTarget?: Function;
};

export class TutorialPointer extends Container {
  private graphics = new Graphics();

  constructor() {
    super();

    this.addChild(this.graphics);

    this.eventMode = "none";
  }

  update(x?: number, y?: number) {
    this.graphics.clear();

    if (x === undefined || y === undefined) {
      this.visible = false;
      return;
    }

    this.visible = true;

    const width = 1000;
    const height = 1000;

    const radius = 50;

    this.graphics.rect(0, 0, width, height);
    this.graphics.fill({
      color: "#000000",
      alpha: 0.15,
    });

    this.graphics.circle(x, y, radius).cut();
  }
}
