import { Container } from "pixi.js";
import { Worker } from "@workers/worker";
import { Building } from "@buildings/building";

export const workers: Worker[] = [];

export function addWorker(
  x: number,
  y: number,
  container: Container,
  currentPlatform: Building,
) {
  const worker = new Worker(x, y, currentPlatform);
  workers.push(worker);
  container.addChild(worker.root);
}

export function moveWorkers(delta: number) {
  for (const worker of workers) {
    worker.moveWorker(delta);
  }
}
