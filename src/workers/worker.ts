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
  private static nextId = 0;

  private readonly workerId = Worker.nextId++;
  root: Container = new Container();
  graphic: Graphics;
  activityGraphic: Graphics = new Graphics();

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
  activityPhase = 0;
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

    const parkingPosition = this.getPlatformPosition(this.currentPlatform);
    this.x = parkingPosition.x;
    this.y = parkingPosition.y;

    this.root.addChild(this.graphic, this.activityGraphic);
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

    this.drawActivityGraphic();
    this.root.addChild(...this.legs);
  }

  private drawActivityGraphic() {
    this.activityGraphic.clear();

    if (this.profession === "building") {
      this.activityGraphic
        .moveTo(9, 1)
        .lineTo(19, -10)
        .stroke({ width: 3, color: "#855c3b", cap: "round" })
        .roundRect(15, -15, 10, 6, 2)
        .fill("#127ce1")
        .stroke({ width: 2, color: "#000000" });
    } else if (this.profession === "delivering") {
      this.activityGraphic
        .roundRect(10, -11, 13, 17, 2)
        .fill("#f4e884")
        .stroke({ width: 2, color: "#000000" })
        .moveTo(13, -6)
        .lineTo(20, -6)
        .moveTo(13, -2)
        .lineTo(19, -2)
        .stroke({ width: 1.5, color: "#746c2d" });
    } else {
      this.activityGraphic
        .circle(16, -4, 7)
        .stroke({ width: 3, color: "#2ccb1a" })
        .circle(16, -4, 2)
        .fill("#2ccb1a")
        .moveTo(16, -11)
        .lineTo(16, -16)
        .moveTo(23, -4)
        .lineTo(28, -4)
        .moveTo(16, 3)
        .lineTo(16, 8)
        .stroke({ width: 2, color: "#000000", cap: "round" });
    }

    this.activityGraphic.alpha = 0.72;
  }

  protected initEvents() {
    this.root.eventMode = "none";
  }

  public moveWorker(delta: number) {
    this.animateActivity(delta);

    if (!this.targetPlatform) {
      if (this.path.length > 0) {
        this.targetPlatform = this.path.shift();
        return;
      }

      if (this.inventory) {
        this.handleResourceLogic();
        return;
      }

      if (!this.task) {
        this.pickTask();
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

    const target = this.getCurrentTargetPosition();
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (isTest || distance <= this.speed * delta + 0.5) {
      this.x = target.x;
      this.y = target.y;
      this.finishCurrentMovement();
      this.root.position.set(this.x, this.y);
      return;
    }

    if (distance === 0) return;

    const angle = Math.atan2(dy, dx);
    this.root.rotation = angle + Math.PI / 2;

    const travelDistance = Math.min(this.speed * delta, distance);
    this.x += (dx / distance) * travelDistance;
    this.y += (dy / distance) * travelDistance;

    this.root.position.set(this.x, this.y);
  }

  private getCurrentTargetPosition() {
    if (!this.targetPlatform) {
      return { x: this.x, y: this.y };
    }

    if (this.path.length === 0) {
      return this.getPlatformPosition(this.targetPlatform);
    }

    return { x: this.targetPlatform.x, y: this.targetPlatform.y };
  }

  private getPlatformPosition(platform: Building) {
    const angle = this.workerId * 2.399963229728653;
    const ring = this.workerId % 7 === 6 ? 0.72 : 0.44;
    const radius = Math.max(12, Math.min(platform.baseSize * ring, 30));

    return {
      x: platform.x + Math.cos(angle) * radius,
      y: platform.y + Math.sin(angle) * radius,
    };
  }

  private finishCurrentMovement() {
    this.onReachPlatform();

    if (this.targetPlatform) return;

    this.isMoving = false;
    this.root.rotation = 0;
    this.setLegsIdlePose(false);
    this.drawLegs();
  }

  private animateActivity(delta: number) {
    this.activityPhase += delta * (this.isWorking ? 0.2 : 0.08);
    const movementBob = this.isMoving
      ? Math.sin(this.activityPhase * 2.2) * 1.7
      : Math.sin(this.activityPhase) * 0.8;

    this.graphic.y = movementBob;

    if (this.profession === "building") {
      const swing = this.isMoving ? 0.12 : 0.35;
      this.activityGraphic.rotation =
        -0.18 + Math.sin(this.activityPhase * 2) * swing;
      this.activityGraphic.y = movementBob;
    } else if (this.profession === "delivering") {
      this.activityGraphic.rotation =
        Math.sin(this.activityPhase * 1.5) * (this.isMoving ? 0.1 : 0.035);
      this.activityGraphic.y = movementBob + Math.sin(this.activityPhase) * 1.5;
    } else {
      this.activityGraphic.rotation +=
        delta * (this.isWorking ? 0.12 : this.isMoving ? 0.03 : 0.015);
      this.activityGraphic.y = movementBob;
      this.activityGraphic.alpha = this.isWorking ? 1 : 0.68;
    }
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
    this.path.shift();

    if (this.path.length === 0) {
      this.handleResourceLogic();
    }
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
        this.path.shift();
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
