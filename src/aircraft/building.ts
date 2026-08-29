import { FederatedPointerEvent, Container, Texture, Graphics } from "pixi.js";
import { Resource } from "@resources/resource";
import { aircraft } from "@aircraft/aircraft";
import { Road } from "@roads/road";
import { Task } from "@dashboard/task";
import { constructionManager } from "@construction/manager";
import {
  Recipe,
  RecipeIngredient,
  RecipeSign,
} from "@aircraft/building-parts/recipe-sign";
import { ResourceStorage } from "@aircraft/building-parts/resource-storage";
import { TaskManager } from "@aircraft/building-parts/task-manager";
import { getRadialPoint } from "@utils/basic-geometry";
import { joystick } from "@joystick/joystick";
import { CraftingProcessor } from "./building-parts/crafting-processor";
import { GeometryCalulator } from "./building-parts/geometry-calculator";
import { BackgroundDisplay } from "./building-parts/background-display";

export interface BuildingConfig {
  storageCenter: {
    x: number;
    y: number;
  };

  storageRadius: number;

  boundsCenter: {
    x: number;
    y: number;
  };

  boundsRadius: number;

  baseGraphicalSize: number;

  minLinkLength: number;
  maxLinkLength: number;
}

export abstract class Building {
  // root
  // ├── recipeSign
  // ├── DEBUGTaskDisplay
  // └── buildingContainer
  //     ├── backgroundDisplay
  //     ├── contentContainer
  //     └── resourceStorage

  root: Container = new Container();

  buildingContainer: Container;

  backgroundDisplay = new BackgroundDisplay();

  contentContainer: Container;
  static readonly buildingConfig: BuildingConfig;
  static baseTexture: Texture;
  geometry: GeometryCalulator;

  links: Road[] = [];

  priorityForTasks: number = -1;
  taskManager: TaskManager;

  craftingProcessor: CraftingProcessor;

  resourceStorage: ResourceStorage;

  recipeSign = new RecipeSign();
  static craftRecipe: Recipe | undefined;
  static constructionRecipe: RecipeIngredient[];

  DEBUGTaskDisplay: Graphics = new Graphics();

  public get buildingConfig(): BuildingConfig {
    return (this.constructor as typeof Building).buildingConfig;
  }

  public get constructionRecipe(): RecipeIngredient[] {
    return (this.constructor as typeof Building).constructionRecipe;
  }

  public get craftRecipe(): Recipe | undefined {
    return (this.constructor as typeof Building).craftRecipe;
  }

  constructor(
    public x: number,
    public y: number,
    public inventorySize: number,
    public buildingType: string,
  ) {
    this.initEvents();

    this.buildingContainer = new Container();
    this.contentContainer = new Container();

    this.geometry = new GeometryCalulator(this);
    this.craftingProcessor = new CraftingProcessor(this);
    this.resourceStorage = new ResourceStorage(
      this.inventorySize,
      this.buildingConfig.storageRadius,
    );
    this.taskManager = new TaskManager(this);

    this.root.x = this.x;
    this.root.y = this.y;

    this.root.addChild(this.recipeSign);
    this.root.addChild(this.DEBUGTaskDisplay);
    this.buildingContainer.addChild(this.backgroundDisplay);
    this.buildingContainer.addChild(this.contentContainer);
    this.buildingContainer.addChild(this.resourceStorage);
    this.root.addChild(this.buildingContainer);

    this.geometry.applyGeometryTransform();
  }

  protected abstract draw(): void;

  public abstract animation(delta: number, movingAngle?: number): void;

  protected initEvents() {
    this.root.eventMode = "static";
    this.root.on("pointerdown", (event: FederatedPointerEvent) =>
      this.onClick(event),
    );
  }

  onClick(event: FederatedPointerEvent) {
    event.stopPropagation();

    joystick.hide();
    constructionManager.hideButton();

    aircraft.hideCraftSigns();
    aircraft.deSelectAllBuildings();

    this.backgroundDisplay.createSelectShadow(
      this.buildingConfig.boundsRadius + 1,
    );
    this.showRecipeState();
  }

  // Geometry

  public orientByBuildDirection(from: Building) {
    this.geometry.orientByBuildDirection(from);
  }

  public getBaseCenterInWorld() {
    return this.geometry.getBaseCenterInWorld();
  }

  public getBoundsCenterInWorld() {
    return this.geometry.getBoundsCenterInWorld();
  }

  addLinkedBuilding(line: Road) {
    this.links.push(line);
  }

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
      const { x, y } = getRadialPoint(
        i,
        16,
        this.buildingConfig.boundsRadius + 16,
      );

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

  public takeResourceByTypeWithoutRefresh(resource: Resource) {
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
    if (!this.craftRecipe) return;

    this.recipeSign.show(
      {
        ingredients: this.craftRecipe.ingredients,
        result: this.craftRecipe.result,
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
    if (!this.craftRecipe) return;

    this.recipeSign.show(
      {
        ingredients: this.craftRecipe.ingredients,
        result: this.craftRecipe.result,
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
