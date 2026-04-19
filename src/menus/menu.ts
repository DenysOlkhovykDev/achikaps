import { Container, Graphics, Text } from "pixi.js";

export interface MenuItem {
  label: string;
  color: string;
  onClick?: () => void;
}

export class Menu {
  container = new Container();

  constructor(
    private items: MenuItem[],
    private x: number,
    private y: number,
    private width: number,
    private height: number,
  ) {
    this.container.addChild(this.drawBackground());

    this.items.forEach((item, index) => {
      this.drawItem(item, index);
    });

    this.container.x = this.x - this.width / 2;
    this.container.y =
      this.y - -1 * this.height - this.height * this.items.length;
  }

  private drawBackground() {
    return new Graphics()
      .rect(-10, -10, this.width + 20, this.height * this.items.length + 10)
      .fill("#cfcbc8");
  }

  private drawItem(item: MenuItem, index: number) {
    const yOffset = index * 50;

    const background = new Graphics()
      .rect(0, yOffset, this.width, this.height - 10)
      .fill(item.color);

    background.eventMode = "static";
    background.cursor = "pointer";

    const text = new Text({
      text: item.label,
      style: { fill: "#000", fontSize: 16 },
    });

    text.x = 10;
    text.y = yOffset + 10;
    text.eventMode = "none";

    background.on("pointerdown", (e) => {
      e.stopPropagation();
      item.onClick?.();
      this.menuHide();
    });

    this.container.addChild(background, text);
  }

  menuShow(parent: Container) {
    parent.addChild(this.container);
  }

  menuHide() {
    this.container.parent?.removeChild(this.container);
  }
}
