import { Application, Container } from "pixi.js";
import {
  setIsBuildMode,
  getIsBuildMode,
  getBuildingType,
  setBuildingType,
} from "@menus/build-menu";
import { moveWorkers } from "@workers/_workers";
import { addBuilding, animations } from "@buildings/_buildings";
import { createTestBulding, createTestWorld } from "./test-poligon";
import { moveWorld } from "./moving/moving";

const app = new Application();

await app.init({
  width: 1000,
  height: 1000,
  background: "#e5ecea",
  resolution: 1,
  antialias: false,
});

(window as any).app = app;
document.body.appendChild(app.canvas);
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

const isTest = import.meta.env.MODE === "test";

if (isTest) {
  let seed = 123;

  Math.random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const keys = new Set<string>();

window.addEventListener("keydown", (e) => {
  keys.add(e.key.toLowerCase());
});

window.addEventListener("keyup", (e) => {
  keys.delete(e.key.toLowerCase());
});

app.stage.on("pointerdown", (event) => {
  const { x, y } = event.global;
  if (getIsBuildMode() && getBuildingType() !== "") {
    addBuilding(x, y, buildingsLayer, getBuildingType());
    setBuildingType("");
  }
  setIsBuildMode(false);
});

const buildingsLayer = new Container();
const workersLayer = new Container();
createTestBulding(buildingsLayer, workersLayer, app.stage);

const worldLayer = new Container();
createTestWorld(worldLayer, app.stage);

app.ticker.add((delta) => {
  const dt = delta.deltaTime;

  const angle = moveWorld(dt, worldLayer, keys, buildingsLayer, workersLayer);

  moveWorkers(dt);

  if (!isTest) {
    animations(dt, angle);
  }
});
