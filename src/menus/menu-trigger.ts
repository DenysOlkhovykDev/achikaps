import { Container, Graphics } from "pixi.js";
import { Menu, MenuItem } from "@menus/menu";

export class MenuTrigger {
  graphic = new Graphics();
  private menu?: Menu;

  constructor(
    private x: number,
    private y: number,
    private items: MenuItem[],
    private width: number,
    private height: number,
    drawIcon: Graphics,
    private parent: Container,
  ) {
    this.graphic = drawIcon;

    this.graphic.eventMode = "static";

    this.graphic.on("pointerdown", (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    parent.addChild(this.graphic);
  }

  private toggleMenu() {
    if (this.menu) {
      this.menu.menuHide();
      this.menu = undefined;
    } else {
      this.menu = new Menu(this.items, this.x, this.y, this.width, this.height);
      this.menu.menuShow(this.parent);
    }
  }

  menuTriggershow() {
    this.parent.addChild(this.graphic);
  }

  menuTriggerHide() {
    this.parent.removeChild(this.graphic);
    this.menu?.menuHide();
    this.menu = undefined;
  }
}
