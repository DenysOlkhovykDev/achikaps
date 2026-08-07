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
import { createTestBuildings } from "./test-poligons/test-buildings";
import { createTestWorld } from "@test-poligons/test-world";
import { moveWorld } from "./moving/moving";
import { Joystick } from "./joystick/joystick";
import { Tutorials } from "./tutorial-overlay/_tutorials";

export const app = new Application();

await app.init({
  width: 1000,
  height: 1000,
  background: "#e5ecea",
  resolution: 2,
  antialias: false,
});

window.app = app;
app.canvas.setAttribute("aria-label", "Achikaps game world");
app.canvas.setAttribute("role", "img");
document.body.appendChild(app.canvas);
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

const isTest = import.meta.env.MODE === "test";

if (isTest) {
  document.body.classList.add("test-mode");

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

window.addEventListener("blur", () => {
  keys.clear();
});

app.stage.on("pointerdown", (event) => {
  const { x, y } = event.global;
  const buildingType = getBuildingType();

  if (getIsBuildMode() && buildingType !== "") {
    addBlueprint(x, y, buildingsLayer, buildingType);
    setBuildingType("");
  }
  setIsBuildMode(false);
  hideCrafts();
  hideJoystick();
});

const tutorials = new Tutorials();
const buildingsLayer = new Container();
const workersLayer = new Container();
const UIcontainer = new Container();

createTestBuildings(
  buildingsLayer,
  workersLayer,
  tutorials,
  UIcontainer,
  app.stage,
);

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
  const deltaTime = isTest ? 1 : delta.deltaTime;
  const keyboardX =
    Number(keys.has("d") || keys.has("arrowright")) -
    Number(keys.has("a") || keys.has("arrowleft"));
  const keyboardY =
    Number(keys.has("s") || keys.has("arrowdown")) -
    Number(keys.has("w") || keys.has("arrowup"));

  const angle = moveWorld(
    deltaTime,
    worldLayer,
    buildingsLayer,
    workersLayer,
    joystick.inputX || keyboardX,
    joystick.inputY || keyboardY,
  );

  moveWorkers(deltaTime);

  if (!isTest) {
    animations(deltaTime, angle);
  }

  movingBlueprints(deltaTime);

  tutorials.updateTutorials();
});
