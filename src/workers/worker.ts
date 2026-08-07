import { Graphics, Container } from "pixi.js";
import { Building } from "@buildings/building";

import { Resource } from "@resources/resource";
import {
  dashboard,
  getPossibleTaskWithHighestPriority,
} from "@dashboard/_dashboard";
import { Task, JobType } from "@dashboard/task";
import { delay } from "@utils/delay";

const isTest = import.meta.env.MODE === "test";

type Leg = {
  x: number;
  y: number;
  isMovingForward: boolean;
};

export type WorkerProfession =
  | typeof JobType.building
  | typeof JobType.delivering
  | typeof JobType.production;

export class Worker {
  root: Container = new Container();
  graphic: Graphics;

  health: number = 100;
  speed: number = 2;
  color: string = "#000000";
  targetPlatform?: Building;

  inventory: Resource | undefined;

  path: Building[] = [];
  reservedResource?: Resource;
  task: Task | undefined;
  isWorking: boolean = false;

  legX = 4;
  legY = 14;
  numberOfLegs = 4;

  legCoordinates: Leg[] = [];
  legs: Graphics[] = [];
  stepPhase = 0;
  isMoving = false;

  constructor(
    public x: number,
    public y: number,
    public currentPlatform: Building,
    public profession: WorkerProfession,
  ) {
    this.graphic = new Graphics();
    this.draw();
    this.initEvents();

    this.root.addChild(this.graphic);
    this.root.position.set(this.x, this.y);
  }

  protected draw() {
    this.graphic.clear();

    for (let i = 0; i < this.numberOfLegs; i++) {
      this.legs[i] = new Graphics();
    }
    this.setLegsIdlePose(false);
    this.drawLegs();

    this.graphic
      .circle(0, 0, 8)
      .stroke({ width: 3, color: "#000000" })
      .fill(this.color);

    this.graphic.circle(-5, -4, 2).fill("#ffffff");
    this.graphic.circle(5, -4, 2).fill("#ffffff");

    let jobColor = "#000000";
    if (this.profession === "building") {
      jobColor = "#127ce1";
    } else if (this.profession === "delivering") {
      jobColor = "#bdb434";
    } else if (this.profession === "production") {
      jobColor = "#2ccb1a";
    }

    this.graphic.circle(0, 3, 4).fill(jobColor);

    this.graphic.position.set(0, 0);

    this.root.addChild(...this.legs);
  }

  protected initEvents() {
    this.root.eventMode = "none";
  }

  public moveWorker(delta: number) {
    if (!this.targetPlatform) {
      if (this.inventory) {
        this.handleResourceLogic();
        return;
      }

      if (!this.task) {
        this.pickTask();
      }

      if (this.path.length > 0) {
        this.targetPlatform = this.path.shift();
      }
      return;
    }
    if (this.targetPlatform) {
      if (!this.isMoving) {
        this.isMoving = true;
        this.setLegsIdlePose(true);
      }
    }
    this.legAnimation(delta);

    if (isTest) {
      this.x = this.targetPlatform.x;
      this.y = this.targetPlatform.y;
      this.onReachPlatform();
    } else {
      const dx = this.targetPlatform.x - this.x;
      const dy = this.targetPlatform.y - this.y;

      const angle = Math.atan2(dy, dx);
      this.root.rotation = angle + Math.PI / 2;

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance === 0) return;

      if (distance < 3) {
        this.onReachPlatform();
        if (!this.task) {
          this.setLegsIdlePose(false);
        }
        this.isMoving = false;
        this.drawLegs();
        return;
      }

      const vx = dx / distance;
      const vy = dy / distance;

      this.x += vx * this.speed * delta;
      this.y += vy * this.speed * delta;
    }

    this.root.position.set(this.x, this.y);
  }

  private legAnimation(delta: number) {
    this.stepPhase += 0.14 * delta;

    const amplitude = 6;

    const groupA = Math.sin(this.stepPhase);
    const groupB = Math.sin(this.stepPhase + Math.PI);

    this.legCoordinates[0].y = -this.legY + groupA * amplitude + amplitude;
    this.legCoordinates[3].y = this.legY + groupA * amplitude + amplitude;

    this.legCoordinates[1].y = -this.legY + groupB * amplitude + amplitude;
    this.legCoordinates[2].y = this.legY + groupB * amplitude + amplitude;

    this.drawLegs();
  }

  private drawLegs() {
    for (let i = 0; i < this.numberOfLegs; i++) {
      this.legs[i].clear();
      this.legs[i]
        .moveTo(0, 0)
        .lineTo(this.legCoordinates[i].x, this.legCoordinates[i].y)
        .stroke({ width: 4, color: "#000000" })
        .circle(this.legCoordinates[i].x, this.legCoordinates[i].y, 2)
        .stroke({ width: 2, color: "#000000" })
        .fill("#000000");
    }
  }

  private setLegsIdlePose(isMoving: boolean) {
    if (isMoving) {
      this.legCoordinates = [
        { x: -this.legX, y: -this.legY, isMovingForward: true },
        { x: this.legX, y: -this.legY, isMovingForward: false },
        { x: -this.legX, y: this.legY + 4, isMovingForward: true },
        { x: this.legX, y: this.legY + 4, isMovingForward: false },
      ];
    } else {
      this.legCoordinates = [
        { x: -this.legX * 2, y: -this.legY, isMovingForward: true },
        { x: this.legX * 2, y: -this.legY, isMovingForward: false },
        { x: -this.legX * 2, y: this.legY, isMovingForward: true },
        { x: this.legX * 2, y: this.legY, isMovingForward: false },
      ];
    }
  }

  private pickTask() {
    if (this.profession === "building") {
      this.task = getPossibleTaskWithHighestPriority(
        this.currentPlatform,
        JobType.building,
      );
      this.pickPathForResource();
    } else if (this.profession === "delivering") {
      this.task = getPossibleTaskWithHighestPriority(
        this.currentPlatform,
        JobType.delivering,
      );
      this.pickPathForResource();
    } else if (this.profession === "production") {
      this.task = getPossibleTaskWithHighestPriority(
        this.currentPlatform,
        JobType.production,
      );
      if (!this.task) return;

      this.path = this.task.getRouteForTarget(this.currentPlatform);
      this.path.shift();

      if (this.path.length === 0) {
        if (
          this.task.target.resources.length < this.task.target.inventorySize
        ) {
          this.handleProductionLogic();
        } else {
          this.task = undefined;
          this.targetPlatform = undefined;
          this.path = [];
        }
      }
    }
  }

  private pickPathForResource() {
    if (!this.task) return;

    const [path, reservedResource] = this.task.getRouteForResource(
      this.currentPlatform,
      true,
    );

    this.path = path;
    this.reservedResource = reservedResource;

    if (path.length === 1) {
      this.handleResourceLogic();
    }

    this.path.shift();
  }

  private onReachPlatform() {
    this.currentPlatform = this.targetPlatform!;

    if (this.path.length > 0) {
      this.targetPlatform = this.path.shift();
      return;
    }

    if (this.profession === "building" || this.profession === "delivering") {
      this.handleResourceLogic();
    } else {
      this.handleProductionLogic();
    }
    this.targetPlatform = undefined;
  }

  private async handleProductionLogic() {
    if (this.isWorking) return;

    this.isWorking = true;
    while (true) {
      if (!isTest) {
        await delay(1000);
      }

      const result = this.task?.target.tryToDoProduction();

      if (!result) break;
    }
    this.isWorking = false;
    this.task = undefined;
  }

  private handleResourceLogic() {
    if (this.reservedResource !== undefined) {
      this.inventory = this.currentPlatform.takeResource(this.reservedResource);
      this.reservedResource = undefined;

      if (!this.inventory) {
        this.task = undefined;
        this.path = [];
        return;
      }

      this.root.addChild(this.inventory.root);

      this.inventory.root.x = 0;
      this.inventory.root.y = 16;

      if (this.task) {
        this.path = this.task.getRouteForTarget(this.currentPlatform);
      }

      return;
    }

    if (this.inventory) {
      const wasDelivered = this.currentPlatform.tryToAddResource(
        this.inventory,
        this.task,
      );

      if (!wasDelivered) {
        return;
      }

      this.inventory = undefined;
      this.task = undefined;
    }
  }
}
