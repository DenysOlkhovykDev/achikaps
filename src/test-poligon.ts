import { Container, Graphics } from "pixi.js";
import { addBuildMenu, setIsBuildMode } from "@menus/build-menu";

import { addWorker } from "@workers/_workers";
import { addBuilding, buildings, select } from "@buildings/_buildings";

import { JobType } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";

import { Iron } from "@resources/iron";
import { Meat } from "@resources/meat";
import { Perl } from "@resources/perl";
import { Battery } from "@resources/battery";

const testTask = getTestTaskFromURL();

function getTestTaskFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("testTask") === "true";
}

export function createTestBulding(
  buildingsLayer: Container,
  workersLayer: Container,
  stage: Container,
) {
  addBuildMenu(stage);
  setIsBuildMode(false);

  addBuilding(300, 450, buildingsLayer, "Platform");
  select(buildings[0]);
  addBuilding(500, 350, buildingsLayer, "Platform");
  addBuilding(500, 550, buildingsLayer, "Platform");
  select(buildings[1]);
  addBuilding(700, 250, buildingsLayer, "Factory");
  addBuilding(700, 380, buildingsLayer, "Mine");
  addBuilding(500, 200, buildingsLayer, "Smelter");
  addBuilding(350, 250, buildingsLayer, "Engine");
  select(buildings[2]);
  addBuilding(700, 530, buildingsLayer, "Farm");
  addBuilding(700, 650, buildingsLayer, "MeatGrinder");
  addBuilding(550, 750, buildingsLayer, "Junkuard");
  addBuilding(450, 650, buildingsLayer, "House");
  addBuilding(500, 450, buildingsLayer, "Windmill");
  addBuilding(350, 550, buildingsLayer, "Laboratory");

  setIsBuildMode(false);

  addWorker(300, 450, workersLayer, buildings[0]);

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

export function createTestWorld(worldLayer: Container, stage: Container) {
  const testCircle = new Graphics()
    .circle(500, 100, 100)
    .stroke({ width: 4, color: "#000000" })
    .fill("#bababa");

  testCircle
    .circle(500, -100, 100)
    .stroke({ width: 4, color: "#000000" })
    .fill("#bababa");

  testCircle
    .circle(-500, -200, 100)
    .stroke({ width: 4, color: "#000000" })
    .fill("#bababa");

  worldLayer.addChild(testCircle);

  stage.addChild(worldLayer);
}
