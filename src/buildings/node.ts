import { Graphics, FederatedPointerEvent } from "pixi.js";

export abstract class Building {
  graphic: Graphics;
  links: Building[] = [];

  constructor(
    public x: number,
    public y: number,
    public color: string,
  ) {
    this.graphic = new Graphics();
    this.draw();
    this.initEvents();
  }

  protected initEvents() {
    this.graphic.eventMode = "static";
    this.graphic.on("pointerdown", (event: FederatedPointerEvent) =>
      this.onClick(event),
    );
  }

  protected draw() {
    this.graphic.clear();

    this.graphic
      .circle(this.x, this.y, 20)
      .stroke({ width: 2, color: "#000000" })
      .fill(this.color);
  }

  addLinkedBuilding(node: Building) {
    this.links.push(node);
  }

  onClick(event: FederatedPointerEvent) {
    event.stopPropagation();
  }
}
