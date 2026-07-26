import { Graphics, FederatedPointerEvent, Container, Texture } from "pixi.js";
import { Resource } from "@resources/resource";
import {
  buidingParameters,
  deSelectAllBuildings,
  hideCrafts,
} from "@buildings/_buildings";
import { Road } from "@roads/road";
import { Task, JobType } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";
import { createResource } from "@resources/_resources";
import { setIsBuildMode } from "@menus/build-menu";
import { makeRoundShadow } from "@utils/basic-graphic";

type ResourceListener = (task: Task) => void;

type Craft = {
  ingridients: { resourceName: string; count: number }[];
  result: string;
};

export abstract class Building {
  root: Container = new Container();

  shadowContainer: Container = new Container();
  selectShadowContainer: Container = new Container();

  contentContainer: Container;
  static baseTexture: Texture;

  resourceContainer: Container = new Container();

  craftSign: Container = new Container();
  craftSignElements: Container[] = [];

  baseSize: number = 0;

  links: Road[] = [];

  resourceList: Map<string, number> = new Map<string, number>();
  recources: Resource[] = [];

  priorityForTasks: number = -1;

  craft: Craft | undefined;
  craftGraphicAlpha: number = 0.45;

  private resourceListeners: ResourceListener[] = [];

  constructor(
    public x: number,
    public y: number,
    public inventorySize: number,
    public buildingType: string,
  ) {
    this.contentContainer = new Container();
    this.initEvents();

    this.root.x = this.x;
    this.root.y = this.y;

    this.root.addChild(this.shadowContainer);
    this.root.addChild(this.selectShadowContainer);
    this.root.addChild(this.contentContainer);
    this.root.addChild(this.resourceContainer);
    this.root.addChild(this.craftSign);

    this.baseSize =
      buidingParameters[
        this.buildingType as keyof typeof buidingParameters
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
    this.showCraft(false);
    setIsBuildMode(false);
    deSelectAllBuildings();
    makeRoundShadow(this.baseSize + 1, "#00ff00", this.selectShadowContainer);
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

        const dx = other.root.x - x;
        const dy = other.root.y - y;

        return Math.sqrt(dx * dx + dy * dy) > minDist;
      });

      if (isValid) {
        res.root.x = x;
        res.root.y = y;
        res.root.rotation = Math.random() * Math.PI * 2;
        return;
      }

      tries++;
    }
    if (tries >= 50) {
      res.root.x = 0;
      res.root.y = 0;
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
    this.resourceContainer.addChild(resource.root);

    const resourceName = resource.resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    this.resourceList.set(resourceName, current + 1);

    this.placeResource(resource);

    if (this.craftSign.children.length > 0) {
      this.updateCraftSign();
    }

    this.generateProductionTask();

    for (const fn of this.resourceListeners) {
      if (task) {
        fn(task);
      }
    }

    return true;
  }

  takeResourceByIndex(resourceIndex: number): Resource {
    const resourceName = this.recources[resourceIndex].resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    if (current > 1) {
      this.resourceList.set(resourceName, current - 1);
    } else {
      this.resourceList.delete(resourceName);
    }

    const [res] = this.recources.splice(resourceIndex, 1);

    this.resourceContainer.removeChild(res.root);

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
      (r) => r.resourceType === resourceName,
    );

    if (index !== -1) {
      this.takeResourceByIndex(index);
      return true;
    }

    return false;
  }

  showCraft(isStandart: boolean) {
    if (this.craft) {
      this.prepareCraftSignElements(isStandart);

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

      const craftResult = createResource(this.craft.result).root;
      craftResult.alpha = isStandart ? 1 : this.craftGraphicAlpha;
      this.craftSignElements.push(craftResult);

      this.drawCraftSign();
    }
  }

  hideCraftSign() {
    this.craftSign.removeChildren();
  }

  prepareCraftSignElements(isStandart: boolean) {
    if (this.craft) {
      this.craftSignElements = [];

      const remeaningCraftIngredients = structuredClone(this.craft.ingridients);

      for (let i = 0; i < remeaningCraftIngredients.length; i++) {
        remeaningCraftIngredients[i].count = 0;
      }

      for (let i = 0; i < this.recources.length; i++) {
        const craftIngredient = remeaningCraftIngredients.find(
          (element) => element.resourceName === this.recources[i].resourceType,
        );
        if (craftIngredient) {
          craftIngredient.count++;
        }
      }

      for (let i = 0; i < this.craft.ingridients.length; i++) {
        for (let j = 0; j < this.craft.ingridients[i].count; j++) {
          if (remeaningCraftIngredients[i].count > 0) {
            this.craftSignElements.push(
              createResource(this.craft.ingridients[i].resourceName).root,
            );
            remeaningCraftIngredients[i].count--;
          } else {
            const craftIngredient = createResource(
              this.craft.ingridients[i].resourceName,
            ).root;
            craftIngredient.alpha = isStandart ? 1 : this.craftGraphicAlpha;
            this.craftSignElements.push(craftIngredient);
          }
        }
      }
    }
  }

  updateCraftSign() {
    this.hideCraftSign();
    this.showCraft(false);
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
