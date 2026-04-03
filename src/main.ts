import { Application, Container } from "pixi.js";
import {
  addBuildMenu,
  setIsBuildMode,
  getBuildingType,
  getIsBuildMode,
} from "./menus/build-menu";

import { addWorker, moveWorkers } from "./workers/_workers";
import { addBuilding, buildings } from "./buildings/_buildings";

import { Iron } from "./resource/iron";
import { Meat } from "./resource/meat";
import { Perl } from "./resource/perl";
import { Battery } from "./resource/battery";

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
  if (getIsBuildMode() && getBuildingType() !== "") {
    addBuilding(x, y, buildingsLayer, getBuildingType());
    setIsBuildMode(false);
  }
});

const buildingsLayer = new Container();
const workersLayer = new Container();

addBuildMenu(app.stage);
setIsBuildMode(false);
addBuilding(500, 400, buildingsLayer, "Platform");
addWorker(500, 400, workersLayer, buildings[0]);

app.stage.addChild(buildingsLayer);
app.stage.addChild(workersLayer);

for (let i = 0; i < 2; i++) {
  const iron = new Iron();
  buildings[0].tryToAddResource(iron);
}

for (let i = 0; i < 3; i++) {
  const iron = new Meat();
  buildings[0].tryToAddResource(iron);
}

for (let i = 0; i < 3; i++) {
  const iron = new Perl();
  buildings[0].tryToAddResource(iron);
}

for (let i = 0; i < 2; i++) {
  const iron = new Battery();
  buildings[0].tryToAddResource(iron);
}
