import { FederatedPointerEvent, Container, Texture } from "pixi.js";
import { Resource } from "@resources/resource";
import { buidingParameters, aircraft } from "@aircraft/aircraft";
import { Road } from "@roads/road";
import { Task, JobType } from "@dashboard/task";
import { addTask, dashboard, deleteTask } from "@dashboard/_dashboard";
import { createResource } from "@resources/_resources";
import { hideBuildMenuTrigger } from "@menus/build-menu";
import { makeRoundShadow } from "@utils/basic-graphic";
import { hideJoystick } from "../main";
import { Recipe, RecipeSign } from "@aircraft/building-parts.ts/recipe-sign";
import { ResourceStorage } from "@aircraft/building-parts.ts/resource-storage";

export abstract class Building {
  root: Container = new Container();

  shadowContainer: Container = new Container();
  selectShadowContainer: Container = new Container();

  contentContainer: Container;
  static baseTexture: Texture;

  resourceStorage: ResourceStorage;

  recipeSign = new RecipeSign();
  craft: Recipe | undefined;

  baseRadius: number = 0;
  decorativeRadius: number = 0;
  baseCenter = { x: 0, y: 0 };
  decorativeCenter = { x: 0, y: 0 };
  orientation: number = 0;

  links: Road[] = [];

  priorityForTasks: number = -1;

  constructor(
    public x: number,
    public y: number,
    public inventorySize: number,
    public buildingType: string,
  ) {
    this.contentContainer = new Container();

    this.configureGeometry(this.buildingType);

    this.resourceStorage = new ResourceStorage(
      this.inventorySize,
      this.baseRadius - 8,
    );
    this.initEvents();

    this.root.x = this.x;
    this.root.y = this.y;

    this.root.addChild(this.shadowContainer);
    this.root.addChild(this.selectShadowContainer);
    this.root.addChild(this.contentContainer);
    this.root.addChild(this.resourceStorage.resourcesContainer);
    this.root.addChild(this.recipeSign.root);

    this.applyGeometryTransform();
  }

  protected configureGeometry(buildingType: string) {
    const parameters =
      buidingParameters[buildingType as keyof typeof buidingParameters];

    this.baseRadius = parameters.baseRadius;
    this.decorativeRadius = parameters.decorativeRadius;
    this.baseCenter = { ...parameters.baseCenter };
    this.decorativeCenter = { ...parameters.decorativeCenter };
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

    this.resourceStorage.resourcesContainer.position.set(
      this.baseCenter.x,
      this.baseCenter.y,
    );
    this.shadowContainer.position.set(decorativeCenter.x, decorativeCenter.y);
    this.selectShadowContainer.position.set(
      decorativeCenter.x,
      decorativeCenter.y,
    );
    this.contentContainer.position.set(decorativeCenter.x, decorativeCenter.y);
    this.recipeSign.root.position.set(
      decorativeCenter.x,
      decorativeCenter.y - this.decorativeRadius - 15,
    );

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
      totalMissingResources <=
      this.inventorySize - this.resourceStorage.recources.length;

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
    return this.resourceStorage.getAvailableResourceCount(resourceName);
  }

  private getRequiredResourceCounts() {
    const requiredResources = new Map<string, number>();

    if (!this.craft) return requiredResources;

    for (const ingredient of this.craft.ingredients) {
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

    const consumedResources = this.craft.ingredients.reduce(
      (total, ingredient) => total + ingredient.count,
      0,
    );

    return (
      this.resourceStorage.recources.length - consumedResources + 1 <=
      this.inventorySize
    );
  }

  public tryToDoProduction(): boolean {
    if (
      this.craft &&
      this.checkIsEnoughResourceswForCraft() &&
      this.hasSpaceForProductionResult()
    ) {
      for (const ingredient of this.craft.ingredients) {
        for (let i = 0; i < ingredient.count; i++) {
          this.takeResourceByName(ingredient.resourceName, false);
        }
      }

      const result = this.craft.result !== undefined ? this.craft.result : "";
      const newResource = createResource(result);
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
    this.showRecipeState();
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

  placeResource(resource: Resource) {
    this.resourceStorage.placeResource(resource);
  }

  onResourceAdded(fn: (task: Task, resource: Resource) => void) {
    return this.resourceStorage.onResourceAdded(fn);
  }

  onStorageChanged(shouldRefreshTasks: boolean) {
    if (this.recipeSign.isShown()) {
      this.updateRecipeSign();
    }

    if (shouldRefreshTasks) {
      this.refreshTasks();
    }
  }

  tryToAddResource(resource: Resource, task?: Task, shouldRefreshTasks = true) {
    const result = this.resourceStorage.tryToAddResource(
      resource,
      task,
      shouldRefreshTasks,
    );

    this.onStorageChanged(shouldRefreshTasks);

    return result;
  }

  takeResourceByIndex(resourceIndex: number, shouldRefreshTasks = true) {
    const result = this.resourceStorage.takeResourceByIndex(
      resourceIndex,
      shouldRefreshTasks,
    );

    this.onStorageChanged(shouldRefreshTasks);

    return result;
  }

  takeResource(resource: Resource, shouldRefreshTasks = true) {
    return this.resourceStorage.takeResource(resource, shouldRefreshTasks);
  }

  takeResourceByName(resourceName: string, shouldRefreshTasks = true) {
    return this.resourceStorage.takeResourceByName(
      resourceName,
      shouldRefreshTasks,
    );
  }

  showRecipeState() {
    if (!this.craft) return;

    this.recipeSign.show(
      {
        ingredients: this.craft.ingredients,
        result: this.craft.result,
      },
      {
        availableResources: this.resourceStorage.recources.map(
          (resource) => resource.resourceType,
        ),
        isAvailableResult: false,
      },
    );
  }

  showRecipeInfo() {
    if (!this.craft) return;

    this.recipeSign.show(
      {
        ingredients: this.craft.ingredients,
        result: this.craft.result,
      },
      {
        availableResources: undefined,
        isAvailableResult: true,
      },
    );
  }

  hideCraftSign() {
    this.recipeSign.hide();
  }

  updateRecipeSign() {
    this.showRecipeState();
  }
}
