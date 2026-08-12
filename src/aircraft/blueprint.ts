import { Container } from "pixi.js";
import { Building } from "@aircraft/building";
import { buidingParameters, aircraft } from "@aircraft/aircraft";
import { getDistance } from "@utils/basic-geometry";
import { Resource } from "@resources/resource";
import { Task } from "@dashboard/task";
import { deleteTask } from "@dashboard/_dashboard";
import { hideBuildMenuTrigger } from "@menus/build-menu";
import { createResource } from "@resources/_resources";
import { Graphics, Sprite } from "pixi.js";

export class Blueprint extends Building {
  redraws: number = 0;

  tasks: Task[] = [];
  buildResources: string[] = [];
  reservedBuildResources: Resource[] = [];

  constructor(
    x: number,
    y: number,
    public type: string,
  ) {
    super(x, y, 10, "Blueprint");
    this.configureGeometry(type);
    this.draw();
  }

  draw() {
    this.createBaseTexture();
  }

  private createBaseTexture() {
    const baseGraphics = new Graphics();

    baseGraphics
      .circle(0, 0, this.decorativeRadius)
      .fill({ color: 0xffffff, alpha: 0 });

    this.drawDashedCircle(baseGraphics, this.decorativeRadius);

    this.contentContainer.addChild(baseGraphics);
  }

  animation(delta: number) {}

  private drawDashedCircle(
    baseGraphics: Graphics,
    radius: number,
    dash = 8,
    gap = 6,
  ) {
    const step = dash + gap;
    const circumference = 2 * Math.PI * radius;
    const count = Math.floor(circumference / step) + 1;

    for (let i = 0; i < count; i++) {
      const startAngle = (i * step) / radius;
      const endAngle = (i * step + dash) / radius;

      const x1 = Math.cos(startAngle) * radius;
      const y1 = Math.sin(startAngle) * radius;

      const x2 = Math.cos(endAngle) * radius;
      const y2 = Math.sin(endAngle) * radius;

      baseGraphics.moveTo(x1, y1);
      baseGraphics.lineTo(x2, y2);
    }

    baseGraphics.stroke({ width: 3 });
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
    const thisDecorativeCenter = this.getDecorativeCenterInWorld();
    const otherDecorativeCenter = building.getDecorativeCenterInWorld();
    const minDistanceToBuilding =
      this.decorativeRadius + building.decorativeRadius + 20;
    const distanceBetween = getDistance(
      otherDecorativeCenter.x,
      otherDecorativeCenter.y,
      thisDecorativeCenter.x,
      thisDecorativeCenter.y,
    );

    const baseCenter = this.getBaseCenterInWorld();
    const sourceBaseCenter = this.links[0].from.getBaseCenterInWorld();
    const linkLength = getDistance(
      sourceBaseCenter.x,
      sourceBaseCenter.y,
      baseCenter.x,
      baseCenter.y,
    );

    const minLinkLength =
      buidingParameters[this.type as keyof typeof buidingParameters]
        .minLinkLength;
    const maxLinkLength =
      buidingParameters[this.type as keyof typeof buidingParameters]
        .maxLinkLength;

    const prevRedraws = this.redraws;

    if (distanceBetween <= minDistanceToBuilding) {
      this.redraws += 5;
      this.moveAwayFrom(
        otherDecorativeCenter.x,
        otherDecorativeCenter.y,
        delta,
        2,
        thisDecorativeCenter,
      );
    }

    if (linkLength <= minLinkLength) {
      this.redraws++;
      this.moveAwayFrom(sourceBaseCenter.x, sourceBaseCenter.y, delta, 0.5);
    }

    if (linkLength >= maxLinkLength) {
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
    const minDist = this.decorativeRadius + 25;
    for (const link of building.links) {
      const fromCenter = link.from.getBaseCenterInWorld();
      const toCenter = link.to.getBaseCenterInWorld();

      const ax = fromCenter.x;
      const ay = fromCenter.y;
      const bx = toCenter.x;
      const by = toCenter.y;

      const decorativeCenter = this.getDecorativeCenterInWorld();
      const px = decorativeCenter.x;
      const py = decorativeCenter.y;

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
        this.moveAwayFrom(closestX, closestY, delta, 2, decorativeCenter);
      }
    }
  }

  public reserveBuildResource(resource: Resource) {
    resource.isReserved = true;
    resource.isReservedForConstruction = true;
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
        task.target.refreshTasks();
      }
    }

    if (this.craftSign.children.length > 0) {
      this.updateCraftSign();
    }

    this.blueprinToBuilding(container);
  }

  public blueprinToBuilding(container: Container) {
    const source = this.links[0]?.from;
    if (!source) return;

    const hasAllReservedResources =
      this.reservedBuildResources.length === this.buildResources.length &&
      this.reservedBuildResources.every((resource) =>
        source.recources.includes(resource),
      );

    if (this.tasks.length === 0 && hasAllReservedResources) {
      for (const resource of this.reservedBuildResources) {
        source.takeResource(resource, false);
      }
      this.reservedBuildResources = [];
      source.refreshTasks();

      aircraft.selectBuilding(source);
      aircraft.addBuilding(this.x, this.y, this.type);
      aircraft.deleteBlueprint(this);
      hideBuildMenuTrigger();
    }
  }

  public cleanup() {
    const source = this.links[0]?.from;

    this.unsubscribe?.();
    this.unsubscribe = undefined;

    for (const resource of this.reservedBuildResources) {
      resource.isReserved = false;
      resource.isReservedForConstruction = false;
    }
    this.reservedBuildResources = [];

    for (const task of this.tasks) {
      if (!task.inProgress) {
        deleteTask(task);
      }
    }
    this.tasks = [];

    source?.refreshTasks();
  }

  public unsubscribe?: () => void;

  showCraft() {
    if (!this.buildResources) return;

    this.prepareBuildCraftSignElements();

    this.drawCraftSign();
  }

  prepareBuildCraftSignElements() {
    this.craftSignElements = [];

    const remeaningCraftIngredients = structuredClone(this.buildResources);

    for (let i = 0; i < this.tasks.length; i++) {
      const index = remeaningCraftIngredients.findIndex(
        (element) => element === this.tasks[i].resource,
      );
      if (index !== -1) {
        remeaningCraftIngredients.splice(index, 1);
      }
    }

    for (let i = 0; i < this.buildResources.length; i++) {
      const index = remeaningCraftIngredients.findIndex(
        (element) => element === this.buildResources[i],
      );

      if (index !== -1) {
        this.craftSignElements.push(
          createResource(this.buildResources[i]).root,
        );
        remeaningCraftIngredients.splice(index, 1);
      } else {
        const craftIngredient = createResource(this.buildResources[i]).root;
        craftIngredient.alpha = this.craftGraphicAlpha;
        this.craftSignElements.push(craftIngredient);
      }
    }
  }
}
