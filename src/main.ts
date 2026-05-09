import { Application, Container } from "pixi.js";
import {
  setIsBuildMode,
  getIsBuildMode,
  getBuildingType,
  setBuildingType,
} from "@menus/build-menu";
import { moveWorkers } from "@workers/_workers";
import {
  addBuilding,
  addBlueprint,
  animations,
  movingBlueprints,
  hideCrafts,
} from "@buildings/_buildings";
import { createTestBulding } from "./test-poligons/test-building";
import { createTestWorld } from "@test-poligons/test-world";
import { moveWorld } from "./moving/moving";
import { Joystick } from "./joystick/joystick";
import { Tutorials } from "./tutorial-overlay/_tutorials";

const app = new Application();

await app.init({
  width: 1000,
  height: 1000,
  background: "#e5ecea",
  resolution: 2,
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
    addBlueprint(x, y, buildingsLayer, getBuildingType());
    setBuildingType("");
  }
  setIsBuildMode(false);
  hideCrafts();
  hideJoystick();
});

const tutorials = new Tutorials();
const buildingsLayer = new Container();
const workersLayer = new Container();

createTestBulding(buildingsLayer, workersLayer, tutorials, app.stage);

export const worldLayer = new Container();
createTestWorld(worldLayer, app.stage);

const joystick = new Joystick();

joystick.position.set(500, 930);
joystick.hide();

export function showJoystick() {
  joystick.show();
}

export function hideJoystick() {
  joystick.hide();
}

app.stage.addChild(joystick);

tutorials.init(app.stage);

app.ticker.add((delta) => {
  const dt = 1;

  const angle = moveWorld(
    dt,
    worldLayer,
    buildingsLayer,
    workersLayer,
    joystick.inputX,
    joystick.inputY,
  );

  moveWorkers(dt);

  if (!isTest) {
    animations(dt, angle);
  }

  movingBlueprints(dt);

  tutorials.updateTutorials();
});
