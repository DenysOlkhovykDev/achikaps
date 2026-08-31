import { Graphics, Container } from "pixi.js";
import { Building } from "@aircraft/building";

import { Inventory } from "./worker-parts/inventory";
import { LegCoordinator } from "./worker-parts/leg-coordinator";
import { TaskManager } from "./worker-parts/task-manager";
import { Navigator } from "./worker-parts/navigator";

export class Worker extends Container {
  body: Graphics = new Graphics();

  mainColor: string = "#000000";

  inventory: Inventory = new Inventory();
  legs: LegCoordinator = new LegCoordinator();
  tasks: TaskManager;
  navigator: Navigator;

  constructor(
    x: number,
    y: number,
    currentPlatform: Building,
    profession: string,
  ) {
    super();

    this.navigator = new Navigator(currentPlatform);
    this.tasks = new TaskManager(profession);

    this.legs.draw();
    this.draw();
    this.initEvents();

    this.addChild(this.legs);
    this.addChild(this.body);
    this.addChild(this.inventory);

    this.position.set(x, y);
  }

  private draw() {
    this.body
      .circle(0, 0, 8)
      .stroke({ width: 3, color: "#000000" })
      .fill(this.mainColor);

    this.body.circle(-5, -4, 2).fill("#ffffff");
    this.body.circle(5, -4, 2).fill("#ffffff");

    let jobColor = "#000000";
    if (this.tasks.profession === "building") {
      jobColor = "#127ce1";
    } else if (this.tasks.profession === "delivering") {
      jobColor = "#bdb434";
    } else if (this.tasks.profession === "production") {
      jobColor = "#2ccb1a";
    }

    this.body.circle(0, 3, 4).fill(jobColor);
  }

  private initEvents() {
    this.eventMode = "none";
  }

  public moveWorker(delta: number) {
    if (!this.tasks.task) {
      this.pickTaskAndPath();
    } else {
      if (this.navigator.state === "moving") {
        this.handleMoving(delta);
      } else if (this.navigator.state === "stay") {
        this.handleStaying(delta);
      }
    }
  }

  private pickTaskAndPath() {
    this.tasks.pickTask(this.navigator.currentPlatform);
    if (this.tasks.task) {
      if (this.tasks.profession === "production") {
        this.navigator.pickPathToBuilding(this.tasks.task);
      } else {
        this.navigator.pickPathToResource(this.tasks.task);
      }
    }
  }

  private handleMoving(delta: number) {
    this.legs.startMoving();
    this.legs.update(delta);

    this.navigator.move(this, delta);
  }

  private handleStaying(delta: number) {
    this.legs.stopMoving();

    if (this.tasks.profession === "production") {
      this.tasks.handleProductionLogic(delta);
    } else {
      const result = this.tasks.handleResourceLogic(
        this.navigator.currentPlatform,
        this.inventory.storage,
      );

      if (result) {
        this.inventory.storeResource(result);
      } else {
        this.inventory.removeResource();
      }

      if (this.tasks.task) {
        this.navigator.pickPathToBuilding(this.tasks.task);
      }
    }
  }
}
