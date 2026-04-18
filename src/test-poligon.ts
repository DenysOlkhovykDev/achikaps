import { Container, Graphics } from "pixi.js";
import { addBuildMenu, setIsBuildMode } from "@menus/build-menu";

import { addWorker } from "@workers/_workers";
import {
  addBuilding,
  addBlueprint,
  buildings,
  select,
} from "@buildings/_buildings";

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
  console.log("createTestBulding start");
  addBuildMenu(stage);
  setIsBuildMode(false);

  const platform0 = addBuilding(300, 450, buildingsLayer, "Platform");
  select(platform0);
  const platform1 = addBuilding(500, 350, buildingsLayer, "Platform");
  const platform2 = addBuilding(500, 550, buildingsLayer, "Platform");
  select(platform1);
  //const factory = addBuilding(700, 250, buildingsLayer, "Factory");
  //const mine = addBuilding(700, 380, buildingsLayer, "Mine");
  //const smelter = addBuilding(500, 200, buildingsLayer, "Smelter");
  // const blueprint0 = addBlueprint(1000, 150, buildingsLayer, "House");
  // const blueprint3 = addBlueprint(900, 150, buildingsLayer, "House");
  // const blueprint4 = addBlueprint(800, 150, buildingsLayer, "House");
  // const blueprint1 = addBlueprint(1000, 350, buildingsLayer, "Junkuard");
  // const blueprint2 = addBlueprint(500, 0, buildingsLayer, "Farm");
  //const blueprint = addBlueprint(385, 330, buildingsLayer, "House");
  //addBuilding(350, 250, buildingsLayer, "Engine");
  select(platform2);
  const farm = addBuilding(700, 530, buildingsLayer, "Farm");
  const meatGrinder = addBuilding(700, 650, buildingsLayer, "MeatGrinder");
  const junkuard = addBuilding(550, 750, buildingsLayer, "Junkuard");
  const house = addBuilding(450, 650, buildingsLayer, "House");
  const windmill = addBuilding(500, 450, buildingsLayer, "Windmill");
  const laboratory = addBuilding(350, 550, buildingsLayer, "Laboratory");

  setIsBuildMode(false);
  console.log("createTestBulding finish");

  addWorker(300, 450, workersLayer, platform0);

  stage.addChild(buildingsLayer);
  stage.addChild(workersLayer);

  for (let i = 0; i < 1; i++) {
    const resource = new Iron();
    platform0.tryToAddResource(resource);
  }

  for (let i = 0; i < 3; i++) {
    const resource = new Meat();
    platform0.tryToAddResource(resource);
  }

  for (let i = 0; i < 2; i++) {
    const resource = new Perl();
    platform0.tryToAddResource(resource);
  }

  for (let i = 0; i < 1; i++) {
    const resource = new Battery();
    platform0.tryToAddResource(resource);
  }

  for (let i = 0; i < 1; i++) {
    const resource = new Meat();
    //factory.tryToAddResource(resource);
  }

  for (let i = 0; i < 1; i++) {
    const resource = new Iron();
    //smelter.tryToAddResource(resource);
  }

  for (let i = 0; i < 1; i++) {
    const resource = new Iron();
    farm.tryToAddResource(resource);
  }

  if (testTask) {
    addTask(platform2, JobType.delivery, 5, "Iron", 3);
    addTask(platform1, JobType.delivery, 9, "Meat", 4);
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
