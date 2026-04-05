import { Application, Container } from "pixi.js";
import {
  addBuildMenu,
  setIsBuildMode,
  getBuildingType,
  getIsBuildMode,
} from "@menus/build-menu";

import { addWorker, moveWorkers, workers } from "@workers/_workers";
import { addBuilding, buildings, select } from "@buildings/_buildings";

import { Task, JobType } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";

import { Iron } from "@resources/iron";
import { Meat } from "@resources/meat";
import { Perl } from "@resources/perl";
import { Battery } from "@resources/battery";

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

addBuilding(200, 400, buildingsLayer, "Platform");
select(buildings[0]);
addBuilding(400, 300, buildingsLayer, "Platform");
addBuilding(400, 500, buildingsLayer, "Platform");
select(buildings[1]);
addBuilding(600, 250, buildingsLayer, "Platform");
addBuilding(600, 350, buildingsLayer, "Platform");
select(buildings[2]);
addBuilding(600, 450, buildingsLayer, "Platform");
addBuilding(600, 550, buildingsLayer, "Platform");

addWorker(200, 400, workersLayer, buildings[0]);

app.stage.addChild(buildingsLayer);
app.stage.addChild(workersLayer);

for (let i = 0; i < 1; i++) {
  const resource = new Iron();
  buildings[0].tryToAddResource(resource);
}

for (let i = 0; i < 3; i++) {
  const resource = new Meat();
  buildings[0].tryToAddResource(resource);
}

for (let i = 0; i < 1; i++) {
  const resource = new Perl();
  buildings[0].tryToAddResource(resource);
}

for (let i = 0; i < 1; i++) {
  const resource = new Battery();
  buildings[0].tryToAddResource(resource);
}

for (let i = 0; i < 1; i++) {
  const resource = new Meat();
  buildings[3].tryToAddResource(resource);
}

for (let i = 0; i < 1; i++) {
  const resource = new Iron();
  buildings[5].tryToAddResource(resource);
}

for (let i = 0; i < 1; i++) {
  const resource = new Iron();
  buildings[6].tryToAddResource(resource);
}

addTask(buildings[2], JobType.delivery, 5, "Iron", 3);
addTask(buildings[1], JobType.delivery, 9, "Meat", 4);
