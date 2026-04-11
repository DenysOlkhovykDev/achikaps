import { Application, Container } from "pixi.js";
import {
  addBuildMenu,
  setIsBuildMode,
  getIsBuildMode,
  getBuildingType,
  setBuildingType,
} from "@menus/build-menu";
import { moveWorkers } from "@workers/_workers";
import { addBuilding, animations } from "@buildings/_buildings";
import { createTestScene } from "./test-poligon";

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

app.ticker.add((delta) => {
  moveWorkers(delta.deltaTime);
  if (!isTest) {
    animations(delta.deltaTime);
  }
});

if (isTest) {
  let seed = 123;

  Math.random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

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

addBuildMenu(app.stage);
setIsBuildMode(false);

createTestScene(buildingsLayer, workersLayer, app.stage);
