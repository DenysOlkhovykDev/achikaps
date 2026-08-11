import { Application, Container } from "pixi.js";
import {
  isVisibleBuildMenuTrigger,
  getBuildingType,
  setBuildingType,
  hideBuildMenuTrigger,
  addBuildMenu,
} from "@menus/build-menu";
import { moveWorkers } from "@workers/_workers";
import {
  addBuilding,
  addBlueprint,
  animations,
  movingBlueprints,
  hideCrafts,
  deSelectAllBuildings,
} from "@aircraft/aircraft";
import { makeTestWorld } from "@test-situations/test-world";
import { moveWorld } from "./moving/moving";
import { Joystick } from "./joystick/joystick";
import { Tutorials } from "./tutorial-overlay/_tutorials";
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

app.stage.on("pointerdown", (event) => {
  const buildingType = getBuildingType();

  if (!isVisibleBuildMenuTrigger() && buildingType !== undefined) {
    const { x, y } = event.global;

    addBlueprint(x, y, airCraftLayer, buildingType);
    setBuildingType(undefined);
  }

  deSelectAllBuildings();

  hideBuildMenuTrigger();
  hideCrafts();
  hideJoystick();
});

const UIcontainer = new Container();
addBuildMenu(UIcontainer);
const joystick = new Joystick();
hideJoystick();

UIcontainer.addChild(joystick);

const tutorials = new Tutorials(); //
const airCraftLayer = new Container(); //
const workersLayer = new Container(); //
export const worldLayer = new Container(); //

createTestSituation(airCraftLayer, workersLayer, worldLayer, tutorials);

app.stage.addChild(airCraftLayer); //
app.stage.addChild(workersLayer); //
app.stage.addChild(worldLayer); //
app.stage.addChild(UIcontainer); //
tutorials.init(app.stage); //

app.ticker.add((delta) => {
  const deltaTime = isTest ? 1 : delta.deltaTime;

  const angle = moveWorld(
    deltaTime,
    worldLayer,
    airCraftLayer,
    workersLayer,
    joystick.inputX,
    joystick.inputY,
  );

  moveWorkers(deltaTime);

  if (!isTest) {
    animations(deltaTime, angle);
  }

  movingBlueprints(deltaTime);

  tutorials.updateTutorials();
});

export function showJoystick() {
  joystick.show();
}

export function hideJoystick() {
  joystick.hide();
}

export function getWorldCoordinates() {
  return { x: worldLayer.pivot.x, y: worldLayer.pivot.y }; //
}
