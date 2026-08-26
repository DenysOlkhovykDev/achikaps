import { Application, Container } from "pixi.js";
import { aircraft } from "@aircraft/aircraft";
import { moveWorld } from "./moving/moving";
import { joystick } from "@joystick/joystick";
import { tutorials, Tutorials } from "./tutorial-overlay/_tutorials";
import { setTestRandom } from "@utils/initializers";
import { createTestSituation } from "@test-situations/test-situation";
import { pauseButton } from "@pause/button";
import { pauseManager } from "@pause/manager";
import { speedButton } from "@speed/button";
import { speedManager } from "@speed/manager";
import { constructionManager } from "@construction/manager";

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

UIcontainer.addChild(joystick);
UIcontainer.addChild(pauseButton);
UIcontainer.addChild(speedButton);
constructionManager.initialize();
UIcontainer.addChild(constructionManager);

const worldLayer = new Container(); // Temp

createTestSituation(worldLayer, tutorials);

aircraft.initilaizeAircraft(app.stage);

app.stage.addChild(worldLayer); // Temp
app.stage.addChild(UIcontainer); // Temp

tutorials.initializaTutorials(app.stage);

app.stage.on("pointerdown", (event) => {
  const buildingType = constructionManager.getBuildingType();

  if (constructionManager.isButtonVisible() && buildingType !== undefined) {
    const { x, y } = event.global;

    aircraft.addBlueprint(x, y, buildingType);
    constructionManager.setBuildingType(undefined);
  }

  aircraft.deSelectAllBuildings();

  constructionManager.hideButton();
  constructionManager.hideMenu();
  aircraft.hideCraftSigns();
  joystick.hide();
});

app.ticker.add((delta) => {
  if (!pauseManager.isPaused()) {
    const deltaTime = isTest ? 1 : delta.deltaTime * speedManager.getSpeed();

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
  }
});

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
