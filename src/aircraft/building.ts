import { Graphics, FederatedPointerEvent, Container, Texture } from "pixi.js";
import { Resource } from "@resources/resource";
import { buidingParameters, aircraft } from "@aircraft/aircraft";
import { Road } from "@roads/road";
import { Task, JobType } from "@dashboard/task";
import { addTask, dashboard, deleteTask } from "@dashboard/_dashboard";
import { createResource } from "@resources/_resources";
import { hideBuildMenuTrigger } from "@menus/build-menu";
import { makeRoundShadow } from "@utils/basic-graphic";
import { hideJoystick } from "../main";

type ResourceListener = (task: Task, resource: Resource) => void;

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

  baseRadius: number = 0;
  decorativeRadius: number = 0;
  baseCenter = { x: 0, y: 0 };
  decorativeCenter = { x: 0, y: 0 };
  orientation: number = 0;

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

    this.configureGeometry(this.buildingType);
  }

  protected configureGeometry(buildingType: string) {
    const parameters =
      buidingParameters[buildingType as keyof typeof buidingParameters];

    this.baseRadius = parameters.baseRadius;
    this.decorativeRadius = parameters.decorativeRadius;
    this.baseCenter = { ...parameters.baseCenter };
    this.decorativeCenter = { ...parameters.decorativeCenter };

    this.applyGeometryTransform();
  }

  private getDecorativeCenterInRoot() {
    const offsetX = this.decorativeCenter.x - this.baseCenter.x;
    const offsetY = this.decorativeCenter.y - this.baseCenter.y;
    const cos = Math.cos(this.orientation);
    const sin = Math.sin(this.orientation);

    return {
      x: this.baseCenter.x + offsetX * cos - offsetY * sin,
      y: this.baseCenter.y + offsetX * sin + offsetY * cos,
    };
  }

  private applyGeometryTransform() {
    const decorativeCenter = this.getDecorativeCenterInRoot();

    this.resourceContainer.position.set(this.baseCenter.x, this.baseCenter.y);
    this.shadowContainer.position.set(decorativeCenter.x, decorativeCenter.y);
    this.selectShadowContainer.position.set(
      decorativeCenter.x,
      decorativeCenter.y,
    );
    this.contentContainer.position.set(decorativeCenter.x, decorativeCenter.y);
    this.craftSign.position.set(decorativeCenter.x, decorativeCenter.y);

    this.shadowContainer.rotation = this.orientation;
    this.selectShadowContainer.rotation = this.orientation;
    this.contentContainer.rotation = this.orientation;
  }

  public setOrientation(angle: number) {
    this.orientation = angle;
    this.applyGeometryTransform();
  }

  public orientByBuildDirection(from: Building) {
    const fromCenter = from.getBaseCenterInWorld();
    const toCenter = this.getBaseCenterInWorld();
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;

    if (dx === 0 && dy === 0) return;

    this.setOrientation(Math.atan2(dy, dx));
  }

  public getBaseCenterInWorld() {
    return {
      x: this.x + this.baseCenter.x,
      y: this.y + this.baseCenter.y,
    };
  }

  public getDecorativeCenterInWorld() {
    const center = this.getDecorativeCenterInRoot();

    return {
      x: this.x + center.x,
      y: this.y + center.y,
    };
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
    this.refreshTasks();
  }

  protected generateDeliveryTasks() {
    this.refreshTasks();
  }

  public refreshTasks() {
    this.syncProductionTask();

    if (!this.craft || this.priorityForTasks < 0) return;

    const missingResources = [...this.getRequiredResourceCounts()].map(
      ([resourceName, requiredCount]) => ({
        resourceName,
        count: Math.max(
          0,
          requiredCount - this.getAvailableResourceCount(resourceName),
        ),
      }),
    );
    const totalMissingResources = missingResources.reduce(
      (total, ingredient) => total + ingredient.count,
      0,
    );
    const canFitMissingResources =
      totalMissingResources <= this.inventorySize - this.recources.length;

    for (const missingResource of missingResources) {
      const tasks = dashboard.filter(
        (task) =>
          task.target === this &&
          task.jobType === JobType.delivering &&
          task.resource === missingResource.resourceName,
      );
      const inProgressCount = tasks.filter((task) => task.inProgress).length;
      const desiredTaskCount = canFitMissingResources
        ? missingResource.count
        : inProgressCount;
      const desiredPendingCount = Math.max(
        0,
        desiredTaskCount - inProgressCount,
      );
      const pendingTasks = tasks.filter((task) => !task.inProgress);

      for (const task of pendingTasks.slice(desiredPendingCount)) {
        deleteTask(task);
      }

      const tasksToCreate = desiredPendingCount - pendingTasks.length;
      if (tasksToCreate > 0) {
        addTask(
          this,
          JobType.delivering,
          this.priorityForTasks,
          missingResource.resourceName,
          tasksToCreate,
        );
      }
    }
  }

  private syncProductionTask() {
    const tasks = dashboard.filter(
      (task) => task.target === this && task.jobType === JobType.production,
    );
    const canProduce =
      this.craft !== undefined &&
      this.priorityForTasks >= 0 &&
      this.checkIsEnoughResourceswForCraft() &&
      this.hasSpaceForProductionResult();

    if (!canProduce) {
      for (const task of tasks) {
        if (!task.inProgress) {
          deleteTask(task);
        }
      }
      return;
    }

    if (tasks.length === 0) {
      addTask(this, JobType.production, this.priorityForTasks);
      return;
    }

    const taskToKeep = tasks.find((task) => task.inProgress) ?? tasks[0];
    for (const task of tasks) {
      if (task !== taskToKeep && !task.inProgress) {
        deleteTask(task);
      }
    }
  }

  private getAvailableResourceCount(resourceName: string) {
    return this.recources.filter(
      (resource) =>
        resource.resourceType === resourceName &&
        !resource.isReservedForTransport &&
        !resource.isReservedForConstruction,
    ).length;
  }

  private getRequiredResourceCounts() {
    const requiredResources = new Map<string, number>();

    if (!this.craft) return requiredResources;

    for (const ingredient of this.craft.ingridients) {
      requiredResources.set(
        ingredient.resourceName,
        (requiredResources.get(ingredient.resourceName) ?? 0) +
          ingredient.count,
      );
    }

    return requiredResources;
  }

  private hasSpaceForProductionResult() {
    if (!this.craft) return false;

    const consumedResources = this.craft.ingridients.reduce(
      (total, ingredient) => total + ingredient.count,
      0,
    );

    return this.recources.length - consumedResources + 1 <= this.inventorySize;
  }

  public tryToDoProduction(): boolean {
    if (
      this.craft &&
      this.checkIsEnoughResourceswForCraft() &&
      this.hasSpaceForProductionResult()
    ) {
      for (const ingredient of this.craft.ingridients) {
        for (let i = 0; i < ingredient.count; i++) {
          this.takeResourceByName(ingredient.resourceName, false);
        }
      }

      const newResource = createResource(this.craft.result);
      const wasAdded = this.tryToAddResource(newResource, undefined, false);
      this.refreshTasks();

      return wasAdded;
    }

    return false;
  }

  public checkIsEnoughResourceswForCraft() {
    if (this.craft) {
      return [...this.getRequiredResourceCounts()].every(
        ([resourceName, requiredCount]) =>
          this.getAvailableResourceCount(resourceName) >= requiredCount,
      );
    }

    return false;
  }

  addLinkedBuilding(line: Road) {
    this.links.push(line);
  }

  onClick(event: FederatedPointerEvent) {
    aircraft.hideCraftSigns();
    this.showCraft(false);
    hideJoystick();
    hideBuildMenuTrigger();
    aircraft.deSelectAllBuildings();
    makeRoundShadow(
      this.decorativeRadius + 1,
      "#00ff00",
      this.selectShadowContainer,
    );
    event.stopPropagation();
  }

  placeResource(res: Resource) {
    const radius = this.baseRadius - 8;
    const minDist = 15;

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
      res.root.rotation = Math.random() * Math.PI * 2;
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

  tryToAddResource(resource: Resource, task?: Task, shouldRefreshTasks = true) {
    if (this.recources.length >= this.inventorySize) return false;

    resource.isReserved = task !== undefined;
    resource.isReservedForTransport = false;
    resource.isReservedForConstruction = false;
    this.recources.push(resource);
    this.resourceContainer.addChild(resource.root);

    const resourceName = resource.resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    this.resourceList.set(resourceName, current + 1);

    this.placeResource(resource);

    if (this.craftSign.children.length > 0) {
      this.updateCraftSign();
    }

    if (task) {
      deleteTask(task);
    }

    if (shouldRefreshTasks) {
      this.refreshTasks();
    }

    for (const fn of this.resourceListeners) {
      if (task) {
        fn(task, resource);
      }
    }

    return true;
  }

  takeResourceByIndex(
    resourceIndex: number,
    shouldRefreshTasks = true,
  ): Resource | undefined {
    if (resourceIndex < 0 || resourceIndex >= this.recources.length) {
      return undefined;
    }

    const resourceName = this.recources[resourceIndex].resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    if (current > 1) {
      this.resourceList.set(resourceName, current - 1);
    } else {
      this.resourceList.delete(resourceName);
    }

    const [res] = this.recources.splice(resourceIndex, 1);

    this.resourceContainer.removeChild(res.root);
    res.isReserved = false;
    res.isReservedForTransport = false;
    res.isReservedForConstruction = false;

    if (shouldRefreshTasks) {
      this.refreshTasks();
    }

    return res;
  }

  takeResource(resource: Resource, shouldRefreshTasks = true) {
    const index = this.recources.indexOf(resource);

    return this.takeResourceByIndex(index, shouldRefreshTasks);
  }

  takeResourceByName(resourceName: string, shouldRefreshTasks = true) {
    const index = this.recources.findIndex(
      (resource) =>
        resource.resourceType === resourceName &&
        !resource.isReservedForTransport &&
        !resource.isReservedForConstruction,
    );

    if (index !== -1) {
      this.takeResourceByIndex(index, shouldRefreshTasks);
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
      .rect(-width / 2, -this.decorativeRadius - height, width, height - 5)
      .fill("#c9c6bb")
      .stroke({ width: 2, color: "#000000" });

    this.craftSign.addChild(background);

    for (let i = 0; i < this.craftSignElements.length; i++) {
      this.craftSignElements[i].position.set(
        (i - center) * spacing,
        -this.decorativeRadius - 15,
      );

      this.craftSign.addChild(this.craftSignElements[i]);
    }
  }
}
