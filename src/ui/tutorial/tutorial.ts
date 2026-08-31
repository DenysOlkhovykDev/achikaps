import { Container, Graphics, Text, TextStyle } from "pixi.js";

import { gameScreen } from "../../game-config";

export class Tutorial extends Container {
  isActive = true;

  overlay = new Graphics();
  radius = 50;

  messageContainer = new Container();
  messageBackGround = new Graphics();
  fontSize = 32;
  message = new Text({
    text: "",
    style: new TextStyle({
      fill: "#000000",
      fontSize: this.fontSize,
    }),
  });

  okButton = new Graphics();
  okText = new Text({
    text: "ok",
    style: new TextStyle({
      fill: "#000000",
      fontSize: 20,
    }),
  });

  constructor(
    public text: string,
    public condition: Function,
    public pointerX?: number,
    public pointerY?: number,
    public findTarget?: Function,
  ) {
    super();

    this.overlay.eventMode = "none";

    this.addChild(this.overlay, this.messageContainer);

    this.messageContainer.addChild(
      this.messageBackGround,
      this.message,
      this.okButton,
      this.okText,
    );

    this.okButton.eventMode = "static";
    this.okText.eventMode = "none";

    this.okButton.on("pointerdown", (event) => {
      this.isActive = false;
      event.stopPropagation();
    });

    this.draw();

    this.visible = false;
  }

  private draw() {
    this.message.text = this.text;

    this.drawOverlay();
    this.drawMessage();
  }

  private drawOverlay() {
    this.overlay.clear();

    this.overlay
      .rect(0, 0, gameScreen.width, gameScreen.height)
      .fill({
        color: "#000000",
        alpha: 0.15,
      })
      .circle(this.pointerX!, this.pointerY!, this.radius)
      .cut();
  }

  private drawMessage() {
    const width = this.message.width;
    const height = this.message.height;

    const messageX = this.pointerX! + this.radius + 20;
    const messageY = this.pointerY! - this.fontSize / 2;

    this.message.position.set(messageX, messageY);

    this.messageBackGround.clear();

    this.messageBackGround
      .roundRect(
        this.pointerX! + this.radius + 10,
        this.pointerY! - this.fontSize / 1.3,
        width + 60,
        height + 20,
        10,
      )
      .fill("#cfcbc8")
      .stroke({
        width: 4,
        color: "#000000",
      });

    const buttonX = this.pointerX! + this.radius + 23 + width;
    const buttonY = this.pointerY! - this.fontSize * 1.4 + height;

    this.okButton.clear();

    this.okButton
      .roundRect(buttonX, buttonY, 40, 25, 10)
      .fill("#a6a4a3")
      .stroke({
        width: 4,
        color: "#000000",
      });

    this.okText.position.set(buttonX + 9, buttonY);
  }

  public updateTutorial() {
    if (this.findTarget !== undefined) {
      const { x: x, y: y } = this.findTarget();

      this.pointerX = x;
      this.pointerY = y;

      this.draw();
    }

    if (!this.condition() && this.visible) {
      this.isActive = false;
    }

    this.visible = this.isActive && this.condition();

    return this.visible;
  }
}
