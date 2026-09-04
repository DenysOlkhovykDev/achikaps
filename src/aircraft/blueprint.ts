import { Container } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import { BuildingClass, aircraft } from "@aircraft/aircraft";
import { getDistance } from "@utils/basic-geometry";
import { Resource } from "@resources/resource";
import { Task } from "@dashboard/task";
import { constructionManager } from "@construction/manager";
import { Graphics } from "pixi.js";

export class Blueprint extends Building {
  static readonly blueprintConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 0,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 0,

    minLinkLength: 120,
    maxLinkLength: 200,

    baseGraphicalSize: 0,
  };

  static constructionRecipe = [];

  private targetBuilding: BuildingClass;
  redraws: number = 0;

  tasks: Task[] = [];
  buildResources: string[] = [];
  reservedBuildResources: Resource[] = [];

  constructor(
    x: number,
    y: number,
    targetBuilding: BuildingClass,
    private targetBuildingType: string,
  ) {
    super(x, y, 10, "Blueprint");

    this.targetBuilding = targetBuilding;
    this.draw();
  }

  public get buildingConfig(): BuildingConfig {
    if (this.targetBuilding) {
      return this.targetBuilding.buildingConfig;
    } else {
      return Blueprint.blueprintConfig;
    }
  }

  draw() {
    this.createBaseTexture();
  }

  private createBaseTexture() {
    const baseGraphics = new Graphics();

    baseGraphics
      .circle(
        this.targetBuilding.buildingConfig.boundsCenter.x,
        this.targetBuilding.buildingConfig.boundsCenter.y,
        this.targetBuilding.buildingConfig.boundsRadius,
      )
      .fill({ color: "#ffffff", alpha: 0 });

    this.drawDashedCircle(
      baseGraphics,
      this.targetBuilding.buildingConfig.boundsCenter.x,
      this.targetBuilding.buildingConfig.boundsCenter.y,
      this.targetBuilding.buildingConfig.boundsRadius,
    );

    this.contentContainer.addChild(baseGraphics);
  }

  animation(delta: number) {}

  private drawDashedCircle(
    graphics: Graphics,
    centerX: number,
    centerY: number,
    radius: number,
    dash = 8,
    gap = 6,
  ) {
    const step = dash + gap;
    const circumference = 2 * Math.PI * radius;
    const amount = Math.floor(circumference / step) + 1;

    for (let i = 0; i < amount; i++) {
      const startAngle = (i * step) / radius;
      const endAngle = (i * step + dash) / radius;

      const x1 = centerX + Math.cos(startAngle) * radius;
      const y1 = centerY + Math.sin(startAngle) * radius;

      const x2 = centerX + Math.cos(endAngle) * radius;
      const y2 = centerY + Math.sin(endAngle) * radius;

      graphics.moveTo(x1, y1);
      graphics.lineTo(x2, y2);
    }

    graphics.stroke({ width: 3 });
  }

  private moveAwayFrom(
    x: number,
    y: number,
    delta: number,
    speed: number,
    center = this.getBaseCenterInWorld(),
  ) {
    const dx = center.x - x;
    const dy = center.y - y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const nx = dx / len;
    const ny = dy / len;

    this.x += nx * speed * delta;
    this.y += ny * speed * delta;
    this.root.position.set(this.x, this.y);
    this.orientByBuildDirection(this.links[0].from);

    for (const link of this.links) {
      link.draw(link.from, link.to);
    }
  }

  private moveTowards(x: number, y: number, delta: number, speed: number) {
    const center = this.getBaseCenterInWorld();
    const dx = x - center.x;
    const dy = y - center.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const nx = dx / len;
    const ny = dy / len;

    this.x += nx * speed * delta;
    this.y += ny * speed * delta;
    this.root.position.set(this.x, this.y);
    this.orientByBuildDirection(this.links[0].from);

    for (const link of this.links) {
      link.draw(link.from, link.to);
    }
  }

  public checkAndMove(building: Building, delta: number) {
    const thisBoundsCenter = this.getBoundsCenterInWorld();
    const otherBoundsCenter = building.getBoundsCenterInWorld();
    const minDistanceToBuilding =
      this.targetBuilding.buildingConfig.boundsRadius +
      building.buildingConfig.boundsRadius +
      20;
    const distanceBetween = getDistance(
      otherBoundsCenter.x,
      otherBoundsCenter.y,
      thisBoundsCenter.x,
      thisBoundsCenter.y,
    );

    const baseCenter = this.getBaseCenterInWorld();
    const sourceBaseCenter = this.links[0].from.getBaseCenterInWorld();
    const linkLength = getDistance(
      sourceBaseCenter.x,
      sourceBaseCenter.y,
      baseCenter.x,
      baseCenter.y,
    );

    const prevRedraws = this.redraws;

    if (distanceBetween <= minDistanceToBuilding) {
      this.redraws += 5;
      this.moveAwayFrom(
        otherBoundsCenter.x,
        otherBoundsCenter.y,
        delta,
        2,
        thisBoundsCenter,
      );
    }

    if (linkLength <= this.targetBuilding.buildingConfig.minLinkLength) {
      this.redraws++;
      this.moveAwayFrom(sourceBaseCenter.x, sourceBaseCenter.y, delta, 0.5);
    }

    if (linkLength >= this.targetBuilding.buildingConfig.maxLinkLength) {
      this.redraws++;
      this.moveTowards(sourceBaseCenter.x, sourceBaseCenter.y, delta, 0.5);
    }

    this.checkLinksCollision(building, delta);
    if (prevRedraws === this.redraws) {
      this.redraws = 0;
      if (this.contentContainer.tint !== 0x000000) {
        this.contentContainer.tint = "#000000";
      }
    } else {
      if (this.contentContainer.tint !== 0xff0000) {
        this.contentContainer.tint = "#ff0000";
      }
    }
  }

  private checkLinksCollision(building: Building, delta: number) {
    const minDist = this.targetBuilding.buildingConfig.boundsRadius + 25;
    for (const link of building.links) {
      const fromCenter = link.from.getBaseCenterInWorld();
      const toCenter = link.to.getBaseCenterInWorld();

      const ax = fromCenter.x;
      const ay = fromCenter.y;
      const bx = toCenter.x;
      const by = toCenter.y;

      const boundsCenter = this.getBoundsCenterInWorld();
      const px = boundsCenter.x;
      const py = boundsCenter.y;

      const abx = bx - ax;
      const aby = by - ay;

      const apx = px - ax;
      const apy = py - ay;

      const abLenSq = abx * abx + aby * aby || 1;

      let t = (apx * abx + apy * aby) / abLenSq;
      t = Math.max(0, Math.min(1, t));

      const closestX = ax + abx * t;
      const closestY = ay + aby * t;

      const dx = px - closestX;
      const dy = py - closestY;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        this.redraws += 5;
        this.moveAwayFrom(closestX, closestY, delta, 2, boundsCenter);
      }
    }
  }

  public reserveBuildResource(resource: Resource) {
    resource.isReserved = true;
    this.reservedBuildResources.push(resource);
  }

  public onBlueprintResourceAdded(
    task: Task,
    resource: Resource,
    container: Container,
  ) {
    if (task.resource) {
      const index = this.tasks.indexOf(task);
      if (index !== -1) {
        this.tasks.splice(index, 1);
        this.reserveBuildResource(resource);
      }
    }

    if (this.recipeSign.isShown()) {
      this.updateRecipeSign();
    }

    this.blueprinToBuilding(container);
  }

  public blueprinToBuilding(container: Container) {
    const source = this.links[0]?.from;
    if (!source) return;

    const hasAllReservedResources =
      this.reservedBuildResources.length === this.buildResources.length &&
      this.reservedBuildResources.every((resource) =>
        source.resourceStorage.recources.includes(resource),
      );

    if (this.tasks.length === 0 && hasAllReservedResources) {
      for (const resource of this.reservedBuildResources) {
        source.takeResourceByTypeWithoutRefresh(resource);
      }
      this.reservedBuildResources = [];

      aircraft.selectBuilding(source);
      aircraft.addBuilding(this.x, this.y, this.targetBuildingType);
      aircraft.deleteBlueprint(this);
      constructionManager.hideButton();
    }
  }

  public cleanup() {
    const source = this.links[0]?.from;

    this.unsubscribe?.();
    this.unsubscribe = undefined;

    for (const resource of this.reservedBuildResources) {
      resource.isReserved = false;
    }
    this.reservedBuildResources = [];

    for (const task of this.tasks) {
      source?.taskManager.cancelTask(task);
    }
    this.tasks = [];
  }

  public unsubscribe?: () => void;

  showRecipeState() {
    this.recipeSign.show(
      {
        ingredients: this.buildResources.map((resourceName) => ({
          resourceName,
          amount: 1,
        })),
      },
      {
        availableResources: this.reservedBuildResources.map(
          (resource) => resource.resourceType,
        ),
      },
    );
  }

  updateRecipeSign() {
    this.showRecipeState();
  }
}
