import { Graphics, Container, Text, TextStyle } from "pixi.js";

export interface Message {
  condition: Function;

  x: number;
  y: number;

  text: string;
  fontSize: number;
}

export class TutorialMessage extends Container {
  private graphics = new Graphics();

  constructor() {
    super();

    this.addChild(this.graphics);

    this.eventMode = "none";
  }

  update(x?: number, y?: number, text?: string, fontSize?: number) {
    this.graphics.clear();

    if (x === undefined || y === undefined || !text) {
      this.visible = false;

      return;
    }

    this.visible = true;

    const width = 1000;
    const height = 1000;

    this.graphics.rect(0, 0, width, height);
    this.graphics.fill({
      color: "#000000",
      alpha: 0.5,
    });

    const textObject = new Text({
      text: text,
      style: new TextStyle({
        fill: "#ffffff",
        fontSize: fontSize,
      }),
    });

    this.addChild(textObject);

    textObject.position.set(x, y);
  }
}
