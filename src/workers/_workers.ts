import { Container } from "pixi.js";
import { Worker } from "./worker";
import { Building } from "../buildings/node";

const workers: Worker[] = [];

export function addWorker(
  x: number,
  y: number,
  container: Container,
  currentPlatform: Building,
) {
  const worker = new Worker(x, y, currentPlatform);
  workers.push(worker);
  container.addChild(worker.graphic);
}

export function moveWorkers() {
  for (const worker of workers) {
    worker.moveWorker();
  }
}
