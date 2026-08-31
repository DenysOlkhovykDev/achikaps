import { Container } from "pixi.js";
import { Worker } from "@workers/worker";
import { Building } from "@aircraft/building";

export class Workers {
  public workers: Worker[] = [];

  public addWorker(
    x: number,
    y: number,
    container: Container,
    currentPlatform: Building,
    profession: string,
  ) {
    const worker = new Worker(x, y, currentPlatform, profession);
    this.workers.push(worker);
    container.addChild(worker);
  }

  public moveWorkers(delta: number) {
    for (const worker of this.workers) {
      worker.moveWorker(delta);
    }
  }
}
