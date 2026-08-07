import { Container, Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { buildings } from "@buildings/_buildings";
import { dashboard, deleteTask, requeueTask } from "@dashboard/_dashboard";
import { JobType, Task } from "@dashboard/task";
import { Resource } from "@resources/resource";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

type Transfer = {
  source: Building;
  target: Building;
  task: Task;
  resource: Resource;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
};

export class Manipulator extends Building {
  private readonly arm = new Graphics();
  private readonly claw = new Container();
  private readonly cargoLayer = new Container();
  private readonly transferRadius = 290;
  private transfer?: Transfer;
  private scanCooldown = 0;
  private idlePhase = 0;

  constructor(x: number, y: number) {
    super(x, y, 1, "Manipulator");
    this.draw();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(Manipulator.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    const clawGraphic = new Graphics()
      .moveTo(-7, -2)
      .lineTo(-10, 7)
      .moveTo(7, -2)
      .lineTo(10, 7)
      .stroke({ width: 4, color: "#24373d", cap: "round" })
      .circle(0, -3, 5)
      .fill("#f2b94b")
      .stroke({ width: 2, color: "#553b12" });
    this.claw.addChild(clawGraphic);
    this.claw.position.set(0, -23);
    this.contentContainer.addChild(this.arm, this.claw);
    this.root.addChild(this.cargoLayer);
  }

  private createBaseTexture() {
    if (Manipulator.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#d29d45", true);
    makeBasicCircle(graphic, this.baseSize - 10, "#f1cf82", false);
    graphic
      .circle(0, 0, 11)
      .fill("#536870")
      .stroke({ width: 3, color: "#24373d" })
      .circle(0, 0, 4)
      .fill("#f2b94b");
    Manipulator.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.idlePhase += delta * 0.04;

    if (this.transfer) {
      this.updateTransfer(delta);
      return;
    }

    this.scanCooldown -= delta;
    this.claw.y = -23 + Math.sin(this.idlePhase) * 3;
    this.claw.rotation = Math.sin(this.idlePhase * 0.7) * 0.12;
    this.drawArm(this.claw.x, this.claw.y);

    if (this.scanCooldown <= 0) {
      this.tryStartTransfer();
      this.scanCooldown = 18;
    }
  }

  private tryStartTransfer() {
    let best:
      | { task: Task; source: Building; resource: Resource; score: number }
      | undefined;

    for (const task of dashboard) {
      if (
        (task.jobType !== JobType.delivering &&
          task.jobType !== JobType.building) ||
        !task.resource ||
        !task.target.isAlive ||
        this.getDistance(task.target) > this.transferRadius
      ) {
        continue;
      }

      for (const source of buildings) {
        if (
          source === this ||
          source === task.target ||
          !source.isAlive ||
          this.getDistance(source) > this.transferRadius
        ) {
          continue;
        }

        const resource = source.resources.find(
          (item) => item.resourceType === task.resource && !item.isReserved,
        );
        if (!resource) continue;

        const score =
          task.priority * 100 -
          this.getDistance(source) -
          this.getDistance(task.target);
        if (!best || score > best.score) {
          best = { task, source, resource, score };
        }
      }
    }

    if (!best) return;

    best.resource.isReserved = true;
    deleteTask(best.task);
    const cargo = best.source.takeResource(best.resource);

    if (!cargo) {
      best.resource.isReserved = false;
      requeueTask(best.task);
      return;
    }

    const startX = best.source.x - this.x;
    const startY = best.source.y - this.y;
    cargo.root.position.set(startX, startY);
    cargo.root.scale.set(1.35);
    this.cargoLayer.addChild(cargo.root);

    this.transfer = {
      source: best.source,
      target: best.task.target,
      task: best.task,
      resource: cargo,
      startX,
      startY,
      endX: best.task.target.x - this.x,
      endY: best.task.target.y - this.y,
      progress: 0,
    };
  }

  private updateTransfer(delta: number) {
    const transfer = this.transfer;
    if (!transfer) return;

    transfer.progress = Math.min(1, transfer.progress + delta * 0.018);
    const eased = transfer.progress * transfer.progress * (3 - 2 * transfer.progress);
    const x = transfer.startX + (transfer.endX - transfer.startX) * eased;
    const y =
      transfer.startY +
      (transfer.endY - transfer.startY) * eased -
      Math.sin(eased * Math.PI) * 42;

    transfer.resource.root.position.set(x, y);
    transfer.resource.root.rotation += delta * 0.08;
    this.claw.position.set(x, y - 15);
    this.claw.rotation = Math.atan2(y, x) + Math.PI / 2;
    this.drawArm(x, y - 15);

    if (transfer.progress < 1) return;

    transfer.resource.root.scale.set(1);
    const delivered =
      transfer.target.isAlive &&
      transfer.target.tryToAddResource(transfer.resource, transfer.task);

    if (!delivered) {
      transfer.source.tryToAddResource(transfer.resource);
      requeueTask(transfer.task);
    }

    this.transfer = undefined;
    this.claw.position.set(0, -23);
    this.claw.rotation = 0;
  }

  private drawArm(x: number, y: number) {
    this.arm.clear();
    const middleX = x * 0.45 + Math.sign(x || 1) * 16;
    const middleY = y * 0.45 - 12;
    this.arm
      .moveTo(0, 0)
      .lineTo(middleX, middleY)
      .lineTo(x, y)
      .stroke({ width: 8, color: "#334950", cap: "round", join: "round" })
      .circle(middleX, middleY, 6)
      .fill("#f2b94b")
      .stroke({ width: 2, color: "#553b12" });
  }

  private getDistance(building: Building) {
    return Math.hypot(building.x - this.x, building.y - this.y);
  }
}
