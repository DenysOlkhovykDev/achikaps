import { Application } from "pixi.js";
import {
  addBuildMenu,
  setIsBuildMode,
  getBuildingType,
} from "./menus/build-menu";

import { addWorker, moveWorkers } from "./workers/_workers";
import { addBuilding, buildings } from "./buildings/_buildings";

const app = new Application();

await app.init({
  width: 1000,
  height: 1000,
  background: "#e5ecea",
});

document.body.appendChild(app.canvas);

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

app.ticker.add(() => {
  moveWorkers();
});

app.stage.on("pointerdown", (event) => {
  const { x, y } = event.global;
  addBuilding(x, y, app.stage, getBuildingType());
  setIsBuildMode(false);
});

addBuildMenu(app.stage);
setIsBuildMode(false);
addBuilding(500, 400, app.stage, "Platform");
addWorker(500, 400, app.stage, buildings[0]);
