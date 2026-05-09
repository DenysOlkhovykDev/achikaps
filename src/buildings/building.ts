import { Graphics, FederatedPointerEvent, Container, Triangle } from "pixi.js";
import { Resource } from "@resources/resource";
import {
  buidingParameters,
  deSelectAllBuildings,
  hideCrafts,
} from "@buildings/_buildings";
import { Road } from "@roads/road";
import { Task, JobType } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";
import { createResource } from "@test-poligons/test-building";
import { setIsBuildMode } from "@menus/build-menu";

type ResourceListener = (task: Task) => void;

type Craft = {
  ingridients: { resourceName: string; count: number }[];
  result: string;
};

export abstract class Building {
  root: Container = new Container();
  mainGraphic: Graphics = new Graphics();

  craftSign: Container = new Container();
  craftSignElements: Graphics[] = [];

  baseSize: number = 0;

  visual: Container;
  links: Road[] = [];

  resourceList: Map<string, number> = new Map<string, number>();
  recources: Resource[] = [];
  resourceContainer: Container = new Container();

  priorityForTasks: number = -1;

  craft: Craft | undefined;

  shadowContainer: Container = new Container();
  selectShadowContainer: Container = new Container();

  private resourceListeners: ResourceListener[] = [];

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
    this.root.addChild(this.craftSign);

    this.baseSize =
      buidingParameters[
        this.constructor.name as keyof typeof buidingParameters
      ].baseSize;
  }

  protected initEvents() {
    this.root.eventMode = "static";
    this.root.on("pointerdown", (event: FederatedPointerEvent) =>
      this.onClick(event),
    );
  }

  protected abstract draw(): void;

  public abstract animation(delta: number, movingAngle?: number): void;

  protected generateProductionTask() {
    if (this.checkIsEnoughResourceswForCraft()) {
      addTask(this, JobType.production, this.priorityForTasks);
    }
  }

  protected generateDeliveryTask(resourceName: string, count: number) {
    addTask(
      this,
      JobType.delivering,
      this.priorityForTasks,
      resourceName,
      count,
    );
  }

  protected generateDeliveryTasks() {
    if (this.craft) {
      let neededSpace = 0;
      for (let i = 0; i < this.craft?.ingridients.length; i++) {
        neededSpace += this.craft?.ingridients[i].count;
      }
      let actualSpace = 0;
      for (const resource of this.resourceList) {
        actualSpace += resource[1];
      }
      if (
        !this.checkIsEnoughResourceswForCraft() &&
        this.inventorySize - actualSpace > neededSpace
      ) {
        for (let i = 0; i < this.craft?.ingridients.length; i++) {
          for (let j = 0; j < this.craft?.ingridients[i].count; j++) {
            this.generateDeliveryTask(
              this.craft?.ingridients[i].resourceName,
              1,
            );
          }
        }
      }
    }
  }

  public tryToDoProduction(): boolean {
    if (this.craft) {
      if (this.checkIsEnoughResourceswForCraft()) {
        for (let i = 0; i < this.craft?.ingridients.length; i++) {
          for (let j = 0; j < this.craft?.ingridients[i].count; j++) {
            this.takeResourceByName(this.craft?.ingridients[i].resourceName);
          }
        }
        const newResource = createResource(this.craft?.result);
        this.generateDeliveryTasks();
        return this.tryToAddResource(newResource);
      }
    }

    return false;
  }

  public checkIsEnoughResourceswForCraft() {
    if (this.craft) {
      let isEnoughResources = true;
      for (let i = 0; i < this.craft?.ingridients.length; i++) {
        const countOfResources =
          this.resourceList.get(this.craft?.ingridients[i].resourceName) ?? 0;

        if (countOfResources < this.craft?.ingridients[i].count) {
          isEnoughResources = false;
        }
      }
      return isEnoughResources;
    } else {
      return false;
    }
  }

  addLinkedBuilding(line: Road) {
    this.links.push(line);
  }

  onClick(event: FederatedPointerEvent) {
    hideCrafts();
    this.showCraft();
    setIsBuildMode(false);
    deSelectAllBuildings();
    this.makeRoundShadow(
      this.baseSize + 1,
      "#00ff00",
      this.selectShadowContainer,
    );
    event.stopPropagation();
  }

  placeResource(res: Resource) {
    const radius = this.baseSize - 8;
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

  onResourceAdded(fn: ResourceListener) {
    this.resourceListeners.push(fn);

    return () => {
      const index = this.resourceListeners.indexOf(fn);
      if (index !== -1) {
        this.resourceListeners.splice(index, 1);
      }
    };
  }

  tryToAddResource(resource: Resource, task?: Task) {
    if (this.recources.length >= this.inventorySize) return false;

    this.recources.push(resource);
    this.resourceContainer.addChild(resource.graphic);

    const resourceName = resource.constructor.name;
    const current = this.resourceList.get(resourceName) ?? 0;

    this.resourceList.set(resourceName, current + 1);

    this.placeResource(resource);
    this.generateProductionTask();

    for (const fn of this.resourceListeners) {
      if (task) {
        fn(task);
      }
    }

    return true;
  }

  takeResourceByIndex(resourceIndex: number): Resource {
    const resourceName = this.recources[resourceIndex].constructor.name;
    const current = this.resourceList.get(resourceName) ?? 0;

    if (current > 1) {
      this.resourceList.set(resourceName, current - 1);
    } else {
      this.resourceList.delete(resourceName);
    }

    const [res] = this.recources.splice(resourceIndex, 1);

    this.resourceContainer.removeChild(res.graphic);

    if (
      this.recources.length < this.inventorySize &&
      this.priorityForTasks > -1
    ) {
      this.generateProductionTask();
    }

    return res;
  }

  takeResourceByName(resourceName: string) {
    const index = this.recources.findIndex(
      (r) => r.constructor.name === resourceName,
    );

    if (index !== -1) {
      this.takeResourceByIndex(index);
      return true;
    }

    return false;
  }

  makeRoundShadow(radius: number, color: string, shadowContainer: Container) {
    const shadow = new Graphics();

    shadow.circle(0, 0, radius + 2).stroke({ width: 1, color: color });

    shadow.alpha = 0.6;

    const shadow2 = new Graphics();

    shadow2.circle(0, 0, radius + 3).stroke({ width: 1, color: color });

    shadow2.alpha = 0.3;

    const shadow3 = new Graphics();

    shadow3.circle(0, 0, radius + 4).stroke({ width: 1, color: color });

    shadow3.alpha = 0.1;

    shadowContainer.addChildAt(shadow, 0);
    shadowContainer.addChildAt(shadow2, 0);
    shadowContainer.addChildAt(shadow3, 0);
    this.visual.addChildAt(shadowContainer, 0);
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

  showCraft() {
    if (this.craft) {
      this.craftSignElements = [];
      for (let i = 0; i < this.craft.ingridients.length; i++) {
        for (let j = 0; j < this.craft.ingridients[i].count; j++) {
          this.craftSignElements.push(
            createResource(this.craft.ingridients[i].resourceName).graphic,
          );
        }
      }
      const arrow = new Graphics();

      arrow
        .moveTo(-5, 0)
        .lineTo(5, 0)
        .moveTo(5, 0)
        .lineTo(0, -5)
        .moveTo(5, 0)
        .lineTo(0, 5)
        .stroke({ width: 2, color: "#000000", cap: "round" });

      this.craftSignElements.push(arrow);

      this.craftSignElements.push(createResource(this.craft.result).graphic);

      this.drawCraftSign();
    }
  }

  hideCraftSign() {
    this.craftSign.removeChildren();
  }

  drawCraftSign() {
    if (!this.craftSignElements) return;

    const spacing = 15;
    const padding = 10;

    const count = this.craftSignElements.length;
    const center = (count - 1) / 2;

    const width = (count - 1) * spacing + padding * 2;
    const height = 25;

    const background = new Graphics();
    background
      .rect(-width / 2, -this.baseSize - height, width, height - 5)
      .fill("#c9c6bb")
      .stroke({ width: 2, color: "#000000" });

    this.craftSign.addChild(background);

    for (let i = 0; i < this.craftSignElements.length; i++) {
      this.craftSignElements[i].position.set(
        (i - center) * spacing,
        -this.baseSize - 15,
      );

      this.craftSign.addChild(this.craftSignElements[i]);
    }
  }
}
