import { FederatedPointerEvent, Container, Texture, Graphics } from "pixi.js";
import { Resource } from "@resources/resource";
import { buidingParameters, aircraft } from "@aircraft/aircraft";
import { Road } from "@roads/road";
import { Task } from "@dashboard/task";
import { createResource } from "@resources/_resources";
import { constructionManager } from "@construction/manager";
import { makeRoundShadow } from "@utils/basic-graphic";
import { Recipe, RecipeSign } from "@aircraft/building-parts.ts/recipe-sign";
import { ResourceStorage } from "@aircraft/building-parts.ts/resource-storage";
import { TaskManager } from "@aircraft/building-parts.ts/task-manager";
import { getRadialPoint } from "@utils/basic-geometry";
import { joystick } from "@joystick/joystick";
import { CraftingProcessor } from "./building-parts.ts/crafting-processor";

export abstract class Building {
  root: Container = new Container();

  shadowContainer: Container = new Container();
  selectShadowContainer: Container = new Container();

  contentContainer: Container;
  static baseTexture: Texture;

  links: Road[] = [];

  baseRadius: number = 0;
  decorativeRadius: number = 0;
  baseCenter = { x: 0, y: 0 };
  decorativeCenter = { x: 0, y: 0 };
  orientation: number = 0;

  craftingProcessor: CraftingProcessor;

  resourceStorage: ResourceStorage;

  recipeSign = new RecipeSign();
  craft: Recipe | undefined;

  priorityForTasks: number = -1;
  taskManager: TaskManager;

  DEBUGTaskDisplay: Graphics = new Graphics();

  constructor(
    public x: number,
    public y: number,
    public inventorySize: number,
    public buildingType: string,
  ) {
    this.contentContainer = new Container();

    this.configureGeometry(this.buildingType);

    this.craftingProcessor = new CraftingProcessor(this);

    this.resourceStorage = new ResourceStorage(
      this.inventorySize,
      this.baseRadius - 8,
    );
    this.taskManager = new TaskManager(this);
    this.initEvents();

    this.root.x = this.x;
    this.root.y = this.y;

    this.root.addChild(this.shadowContainer);
    this.root.addChild(this.selectShadowContainer);
    this.root.addChild(this.contentContainer);
    this.root.addChild(this.resourceStorage.resourcesContainer);
    this.root.addChild(this.recipeSign.root);
    this.root.addChild(this.DEBUGTaskDisplay);

    this.applyGeometryTransform();
  }

  // Geometry // Fix

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

  addLinkedBuilding(line: Road) {
    this.links.push(line);
  }

  onClick(event: FederatedPointerEvent) {
    aircraft.hideCraftSigns();
    this.showRecipeState();
    joystick.hide();
    constructionManager.hideButton();
    aircraft.deSelectAllBuildings();
    makeRoundShadow(
      this.decorativeRadius + 1,
      "#00ff00",
      this.selectShadowContainer,
    );
    event.stopPropagation();
  }

  protected abstract draw(): void;

  public abstract animation(delta: number, movingAngle?: number): void;

  // TaskManager

  protected refreshTasks() {
    this.taskManager.refreshTasks();

    if (import.meta.env.VITE_IS_DEBUG === "true") {
      this.updateTaskDisplay();
    }
  }

  private updateTaskDisplay() {
    this.DEBUGTaskDisplay.clear();

    const taskList = [
      ...this.taskManager.deliveringTasks,
      ...this.taskManager.productionTasks,
      ...this.taskManager.buildingTasks,
    ];

    for (let i = 0; i < taskList.length; i++) {
      const { x, y } = getRadialPoint(i, 16, this.baseRadius + 16);

      if (taskList[i].jobType === "delivering") {
        this.DEBUGTaskDisplay.circle(x, y, 10).fill("#ffff00");
      } else if (taskList[i].jobType === "production") {
        this.DEBUGTaskDisplay.circle(x, y, 10).fill("#00ff00");
      } else if (taskList[i].jobType === "building") {
        this.DEBUGTaskDisplay.circle(x, y, 10).fill("#0000ff");
      }
    }
  }

  // ResourceProduction

  public tryToDoProduction() {
    return this.craftingProcessor.tryToDoProduction();
  }

  // ResourceStorage

  public unsubscribeResourceListners(
    fn: (task: Task, resource: Resource) => void,
  ) {
    return this.resourceStorage.unsubscribeResourceListners(fn);
  }

  public tryToAddResource(resource: Resource, task?: Task) {
    const result = this.resourceStorage.tryToAddResource(resource, task);

    if (result) {
      this.onResourceStorageChanged();
    }

    return result;
  }

  public takeResourceByType(resource: Resource) {
    const result = this.resourceStorage.takeResourceByType(resource);

    this.onResourceStorageChanged();

    return result;
  }

  protected takeResourceByTypeWithoutRefresh(resource: Resource) {
    return this.resourceStorage.takeResourceByType(resource);
  }

  private onResourceStorageChanged() {
    if (this.recipeSign.isShown()) {
      this.updateRecipeSign();
    }

    this.refreshTasks();
  }

  // RecipeSign

  public showRecipeState() {
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

  public showRecipeInfo() {
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

  public hideRecipeSign() {
    this.recipeSign.hide();
  }

  public updateRecipeSign() {
    this.showRecipeState();
  }
}
