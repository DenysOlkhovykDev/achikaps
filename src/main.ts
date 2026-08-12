import { Application, Container } from "pixi.js";
import {
  isVisibleBuildMenuTrigger,
  getBuildingType,
  setBuildingType,
  hideBuildMenuTrigger,
  addBuildMenu,
} from "@menus/build-menu";
import { aircraft } from "@aircraft/aircraft";
import { moveWorld } from "./moving/moving";
import { Joystick } from "./joystick/joystick";
import { tutorials, Tutorials } from "./tutorial-overlay/_tutorials";
import { setTestRandom } from "@utils/initializers";
import { createTestSituation } from "@test-situations/test-situation";

export const app = new Application();

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
  setTestRandom();
}

const UIcontainer = new Container(); // Temp
addBuildMenu(UIcontainer); // Temp
const joystick = new Joystick(); // Temp
hideJoystick(); // Temp

UIcontainer.addChild(joystick); // Temp

const worldLayer = new Container(); // Temp

createTestSituation(worldLayer, tutorials);

aircraft.initilaizeAircraft(app.stage);

app.stage.addChild(worldLayer); // Temp
app.stage.addChild(UIcontainer); // Temp

tutorials.initializaTutorials(app.stage);

app.stage.on("pointerdown", (event) => {
  const buildingType = getBuildingType();

  if (isVisibleBuildMenuTrigger() && buildingType !== undefined) {
    const { x, y } = event.global;

    aircraft.addBlueprint(x, y, buildingType);
    setBuildingType(undefined);
  }

  aircraft.deSelectAllBuildings();

  hideBuildMenuTrigger();
  aircraft.hideCraftSigns();
  hideJoystick();
});

app.ticker.add((delta) => {
  const deltaTime = isTest ? 1 : delta.deltaTime;

  const angle = moveWorld(
    deltaTime,
    worldLayer,
    aircraft.airCraftLayer,
    aircraft.workersLayer,
    joystick.inputX,
    joystick.inputY,
  );

  aircraft.workers.moveWorkers(deltaTime);

  if (!isTest) {
    aircraft.buildingAnimations(deltaTime, angle);
  }

  aircraft.movingBlueprints(deltaTime);

  tutorials.updateTutorials();
});

export function showJoystick() {
  joystick.show();
}

export function hideJoystick() {
  joystick.hide();
}

export function getWorldCoordinates() {
  return { x: worldLayer.pivot.x, y: worldLayer.pivot.y }; // Temp
}

export function getGlobalWorldCoordinates(x: number, y: number) {
  const global = worldLayer.toGlobal({
    x: x,
    y: y,
  });

  return { x: global.x, y: global.y }; // Temp
}
