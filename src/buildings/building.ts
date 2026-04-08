import { Graphics, FederatedPointerEvent, Container, Triangle } from "pixi.js";
import { Resource } from "@resources/resource";

export abstract class Building {
  root: Container = new Container();
  mainGraphic = new Graphics();

  baseSize: number = 0;

  visual: Container;
  links: Building[] = [];

  recources: Resource[] = [];
  resourceContainer: Container = new Container();

  constructor(
    public x: number,
    public y: number,
    public inventorySize: number,
  ) {
    this.visual = new Container();
    this.initEvents();

    this.root.x = this.x;
    this.root.y = this.y;

    this.root.addChild(this.visual);
    this.root.addChild(this.resourceContainer);
  }

  protected initEvents() {
    this.root.eventMode = "static";
    this.root.on("pointerdown", (event: FederatedPointerEvent) =>
      this.onClick(event),
    );
  }

  protected abstract draw(): void;

  public abstract animation(): void;

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

  makeRoundShadow(radius: number) {
    const shadow = new Graphics();

    shadow.circle(0, 0, radius + 2).stroke({ width: 1, color: "#000000" });

    shadow.alpha = 0.6;

    const shadow2 = new Graphics();

    shadow2.circle(0, 0, radius + 3).stroke({ width: 1, color: "#000000" });

    shadow2.alpha = 0.3;

    const shadow3 = new Graphics();

    shadow3.circle(0, 0, radius + 4).stroke({ width: 1, color: "#000000" });

    shadow3.alpha = 0.1;

    this.visual.addChildAt(shadow, 0);
    this.visual.addChildAt(shadow2, 0);
    this.visual.addChildAt(shadow3, 0);
  }

  makeBasicCircle(size: number, color: string, isStroke: boolean) {
    this.mainGraphic.circle(0, 0, size);
    if (isStroke) {
      this.mainGraphic.stroke({ width: 3, color: "#000000" });
    }
    this.mainGraphic.fill(color);
  }

  getRadialPoint(i: number, count: number, radius: number) {
    const angle = (Math.PI * 2 * i) / count;

    return {
      angle,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }
}
