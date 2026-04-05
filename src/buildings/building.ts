import { Graphics, FederatedPointerEvent, Container } from "pixi.js";
import { Resource } from "@resources/resource";

export abstract class Building {
  root: Container = new Container();

  graphic: Graphics;
  links: Building[] = [];

  recources: Resource[] = [];
  resourceContainer: Container = new Container();

  constructor(
    public x: number,
    public y: number,
    public color: string,
    public inventorySize: number,
  ) {
    this.graphic = new Graphics();
    this.draw();
    this.initEvents();

    this.root.x = this.x;
    this.root.y = this.y;

    this.root.addChild(this.graphic);
    this.root.addChild(this.resourceContainer);
  }

  protected initEvents() {
    this.root.eventMode = "static";
    this.root.on("pointerdown", (event: FederatedPointerEvent) =>
      this.onClick(event),
    );
  }

  protected draw() {
    this.graphic.clear();

    this.graphic
      .circle(0, 0, 40)
      .stroke({ width: 3, color: "#000000" })
      .fill(this.color);
  }

  addLinkedBuilding(node: Building) {
    this.links.push(node);
  }

  onClick(event: FederatedPointerEvent) {
    event.stopPropagation();
  }

  placeResource(res: Resource) {
    const radius = 32;
    const minDist = 12;

    let tries = 0;

    while (tries < 50) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;

      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      const isValid = this.recources.every((other) => {
        if (other === res) return true;

        const dx = other.graphic.x - x;
        const dy = other.graphic.y - y;

        return Math.sqrt(dx * dx + dy * dy) > minDist;
      });

      if (isValid) {
        res.graphic.x = x;
        res.graphic.y = y;
        res.graphic.rotation = Math.random() * Math.PI * 2;
        return;
      }

      tries++;
    }
    if (tries >= 50) {
      res.graphic.x = 0;
      res.graphic.y = 0;
    }
  }

  tryToAddResource(resource: Resource) {
    if (this.recources.length >= this.inventorySize) return false;

    this.recources.push(resource);
    this.resourceContainer.addChild(resource.graphic);

    this.placeResource(resource);

    return true;
  }

  takeResource(resourceIndex: number): Resource {
    const [res] = this.recources.splice(resourceIndex, 1);

    this.resourceContainer.removeChild(res.graphic);

    return res;
  }
}
