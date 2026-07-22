import { Container } from "pixi.js";
import { Building } from "@buildings/building";
import { buidingParameters, select } from "@buildings/_buildings";
import { getDistance } from "@utils/basic-geometry";
import { Resource } from "@resources/resource";
import { addBuilding } from "@buildings/_buildings";
import { deleteBlueprint } from "@buildings/_buildings";
import { Task } from "@dashboard/task";
import { setIsBuildMode } from "@menus/build-menu";
import { createResource } from "@resources/_resources";
import { app } from "../main";
import { Graphics, Sprite } from "pixi.js";

export class Blueprint extends Building {
  redraws: number = 0;

  tasks: Task[] = [];
  buildResources: string[] = [];

  constructor(
    x: number,
    y: number,
    public type: string,
  ) {
    super(x, y, 10, "Blueprint");
    this.baseSize =
      buidingParameters[type as keyof typeof buidingParameters].baseSize;
    this.draw();
  }

  draw() {
    this.createBaseTexture();
  }

  private createBaseTexture() {
    const baseGraphics = new Graphics();

    baseGraphics
      .circle(0, 0, this.baseSize)
      .fill({ color: 0xffffff, alpha: 0 });

    this.drawDashedCircle(baseGraphics, this.baseSize);

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

  private moveAwayFrom(x: number, y: number, delta: number, speed: number) {
    const dx = this.x - x;
    const dy = this.y - y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const nx = dx / len;
    const ny = dy / len;

    const resX = this.x + nx * speed * delta;
    const resY = this.y + ny * speed * delta;

    this.x = resX;
    this.y = resY;
    this.root.position.set(resX, resY);

    for (const link of this.links) {
      link.draw(link.from, link.to);
    }
  }

  private moveTowards(x: number, y: number, delta: number, speed: number) {
    const dx = x - this.x;
    const dy = y - this.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const nx = dx / len;
    const ny = dy / len;

    const resX = this.x + nx * speed * delta;
    const resY = this.y + ny * speed * delta;

    this.x = resX;
    this.y = resY;
    this.root.position.set(resX, resY);

    for (const link of this.links) {
      link.draw(link.from, link.to);
    }
  }

  public checkAndMove(building: Building, delta: number) {
    const minDistance = this.baseSize + 20;
    const minDistanceToBuilding = building.baseSize + minDistance;
    const distanceBetween = getDistance(building.x, building.y, this.x, this.y);
    const linkLength = getDistance(
      this.links[0].from.x,
      this.links[0].from.y,
      this.x,
      this.y,
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
      this.moveAwayFrom(building.x, building.y, delta, 2);
    }

    if (linkLength <= minLinkLength) {
      this.redraws++;
      this.moveAwayFrom(this.links[0].from.x, this.links[0].from.y, delta, 0.5);
    }

    if (linkLength >= maxLinkLength) {
      this.redraws++;
      this.moveTowards(this.links[0].from.x, this.links[0].from.y, delta, 0.5);
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
    const minDist = this.baseSize + 25;
    for (const link of building.links) {
      const ax = link.from.x;
      const ay = link.from.y;
      const bx = link.to.x;
      const by = link.to.y;

      const px = this.x;
      const py = this.y;

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
        this.moveAwayFrom(closestX, closestY, delta, 2);
      }
    }
  }

  public onBlueprintResourceAdded(task: Task, container: Container) {
    if (task.resource) {
      const index = this.tasks.indexOf(task);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
    }

    if (this.craftSign.children.length > 0) {
      this.updateCraftSign();
    }

    this.blueprinToBuilding(container);
  }

  public blueprinToBuilding(container: Container) {
    if (this.tasks.length === 0) {
      select(this.links[0].from);
      addBuilding(this.x, this.y, container, this.type);
      for (const resource of this.buildResources) {
        if (resource) {
          this.links[0].from.takeResourceByName(resource);
        }
      }
      deleteBlueprint(this);
      setIsBuildMode(false);
    }
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
          createResource(this.buildResources[i]).graphic,
        );
        remeaningCraftIngredients.splice(index, 1);
      } else {
        const craftIngredient = createResource(this.buildResources[i]).graphic;
        craftIngredient.alpha = this.craftGraphicAlpha;
        this.craftSignElements.push(craftIngredient);
      }
    }
  }
}
