import { Graphics, Container, Text, TextStyle } from "pixi.js";
import { TutorialCondition } from "./tutorial-pointer";

export type Message = {
  condition: TutorialCondition;

  x: number;
  y: number;

  text: string;
  fontSize: number;
};

export class TutorialMessage extends Container {
  private graphics = new Graphics();
  private textObject = new Text({
    text: "",
    style: new TextStyle({
      fill: "#ffffff",
      fontSize: 24,
    }),
  });

  constructor() {
    super();

    this.addChild(this.graphics, this.textObject);

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

    this.textObject.text = text;
    this.textObject.style.fontSize = fontSize ?? 24;
    this.textObject.position.set(x, y);
  }
}
