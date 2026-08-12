import { Application, Container } from "pixi.js";
import {
  isVisibleBuildMenuTrigger,
  getBuildingType,
  setBuildingType,
  hideBuildMenuTrigger,
  addBuildMenu,
} from "@menus/build-menu";
import { aircraft } from "@aircraft/aircraft";
import { moveWorkers } from "@workers/_workers";
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

const UIcontainer = new Container();
addBuildMenu(UIcontainer);
const joystick = new Joystick();
hideJoystick();

UIcontainer.addChild(joystick);

const tutorials = new Tutorials(); //
export const worldLayer = new Container(); //

createTestSituation(worldLayer, tutorials);

aircraft.initilaizeAircraft(app.stage);

app.stage.addChild(worldLayer); //
app.stage.addChild(UIcontainer); //

tutorials.initializaTutorials(app.stage);

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

  moveWorkers(deltaTime);

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
  return { x: worldLayer.pivot.x, y: worldLayer.pivot.y }; //
}
