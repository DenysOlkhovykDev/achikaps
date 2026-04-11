import { Container } from "pixi.js";
import { setIsBuildMode } from "@menus/build-menu";

import { addWorker } from "@workers/_workers";
import { addBuilding, buildings, select } from "@buildings/_buildings";

import { Task, JobType } from "@dashboard/task";
import {
  addTask,
  getPosibleTaskWithHighestPriority,
} from "@dashboard/_dashboard";

import { Iron } from "@resources/iron";
import { Meat } from "@resources/meat";
import { Perl } from "@resources/perl";
import { Battery } from "@resources/battery";

const testTask = getTestTaskFromURL();

function getTestTaskFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("testTask") === "true";
}

export function createTestScene(
  buildingsLayer: Container,
  workersLayer: Container,
  stage: Container,
) {
  addBuilding(200, 400, buildingsLayer, "Platform");
  select(buildings[0]);
  addBuilding(400, 300, buildingsLayer, "Platform");
  addBuilding(400, 500, buildingsLayer, "Platform");
  select(buildings[1]);
  addBuilding(600, 200, buildingsLayer, "Factory");
  addBuilding(600, 330, buildingsLayer, "Mine");
  addBuilding(400, 150, buildingsLayer, "Smelter");
  select(buildings[2]);
  addBuilding(600, 480, buildingsLayer, "Farm");
  addBuilding(600, 600, buildingsLayer, "MeatGrinder");
  addBuilding(450, 700, buildingsLayer, "Junkuard");
  addBuilding(350, 600, buildingsLayer, "House");
  addBuilding(400, 400, buildingsLayer, "Windmill");
  addBuilding(250, 500, buildingsLayer, "Laboratory");

  setIsBuildMode(false);

  addWorker(200, 400, workersLayer, buildings[0]);

  stage.addChild(buildingsLayer);
  stage.addChild(workersLayer);

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

  if (testTask) {
    addTask(buildings[2], JobType.delivery, 5, "Iron", 3);
    addTask(buildings[1], JobType.delivery, 9, "Meat", 4);
  }
}
