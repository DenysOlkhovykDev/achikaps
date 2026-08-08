import { Container } from "pixi.js";
import {
  addBuildMenu,
  getBuildingType,
  getIsBuildMode,
  getIsMenuActive,
} from "@menus/build-menu";

import { addWorker } from "@workers/_workers";
import {
  addBuilding,
  addBlueprint,
  buildings,
  select,
  hideCrafts,
  blueprints,
} from "@buildings/_buildings";

import { JobType } from "@dashboard/task";
import { addTask, dashboard } from "@dashboard/_dashboard";

import { Tutorials } from "../tutorial-overlay/_tutorials";
import { worldLayer } from "../main";
import { getDistance } from "@utils/basic-geometry";
import { createResource } from "@resources/_resources";

import { autoConstructionOfBuildings } from "../../tests/scenarios/auto-construction-of-buildings";
import { collisionBlueprints } from "../../tests/scenarios/collision-blueprints";
import { movingResources } from "../../tests/scenarios/moving-resources";
import { movingBlueprints } from "../../tests/scenarios/moving-blueprints";
import { craftingResources } from "../../tests/scenarios/crafting-resources";
import { constructionOfBuildings } from "../../tests/scenarios/construction-of-buildings";
import { multipleConstructionOfBuildings } from "../../tests/scenarios/multiple-construction-of-buildings";
import { multipleConstructionOfDifferentBuildings } from "../../tests/scenarios/multiple-construction-of-different-buildings";
import { productionResources } from "../../tests/scenarios/production-resources";
import { sceneRender } from "../../tests/scenarios/scene-render";
import { showingPointers } from "../../tests/scenarios/showing-pointers";
import { differentAngles } from "../../tests/scenarios/different-angles";

function getScenarioName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario") || "default";
}

export type Scenario = {
  buildings: {
    from: string;
    id: string;
    type: string;
    x: number;
    y: number;
  }[];

  resources?: {
    buildingId: string;
    type: string;
    count: number;
  }[];

  workers?: {
    buildingId: string;
    profession: string;
  }[];

  deliveryTasks?: {
    target: string;
    priority: number;
    resource: string;
    count: number;
  }[];

  buildingTasks?: {
    from: string;
    x: number;
    y: number;
    buildingType: string;
  }[];

  pointers?: {
    condition: Function;
    x?: number;
    y?: number;
    findTarget?: Function;
  }[];

  compasses?: {
    condition: Function;
    findTarget?: Function;
  }[];

  messages?: {
    condition: Function;
    x: number;
    y: number;
    text: string;
    fontSize: number;
  }[];
};

const scenarios: Record<string, Scenario> = {
  default: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 500, y: 400 },
      { from: "p0", id: "factory", type: "Factory", x: 400, y: 350 },
      { from: "p0", id: "farm", type: "Farm", x: 600, y: 350 },
      { from: "p0", id: "mine", type: "Mine", x: 500, y: 300 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 500 },
      { from: "p1", id: "p2", type: "Platform", x: 500, y: 600 },
    ],
    workers: [
      { buildingId: "p0", profession: "building" },
      { buildingId: "p0", profession: "production" },
      { buildingId: "p0", profession: "delivering" },
    ],
    buildingTasks: [
      {
        from: "p2",
        x: 500,
        y: 700,
        buildingType: "Engine",
      },
    ],
    pointers: [
      {
        condition: () => blueprints.length > 0,

        findTarget: () => {
          const blueprint = blueprints[0];

          if (!blueprint) {
            return;
          }

          return {
            x: blueprint.x,
            y: blueprint.y,
          };
        },
      },
      {
        condition: () => {
          return (
            blueprints.length > 0 && blueprints[0].craftSign.children.length > 0
          );
        },

        findTarget: () => {
          const building = buildings[0];

          if (!building) {
            return;
          }

          return {
            x: building.x,
            y: building.y,
          };
        },
      },
      {
        condition: () => {
          return getIsBuildMode();
        },
        x: 500,
        y: 950,
      },
      {
        condition: () => {
          return getIsMenuActive();
        },
        x: 500,
        y: 800,
      },
      {
        condition: () => {
          return getBuildingType() !== "";
        },
        x: 600,
        y: 500,
      },
      {
        condition: () => {
          const engines = buildings.filter((b) => b.buildingType === "Engine");

          return engines.length > 0;
        },

        findTarget: () => {
          const engines = buildings.filter((b) => b.buildingType === "Engine");

          if (engines.length === 0) {
            return;
          }

          return {
            x: engines[0].x,
            y: engines[0].y,
          };
        },
      },
    ],

    compasses: [
      {
        condition: () => true,

        findTarget: () => {
          return {
            x: 1000,
            y: 100,
          };
        },
      },
    ],

    messages: [
      {
        condition: () => {
          if (
            getDistance(worldLayer.pivot.x, worldLayer.pivot.y, 1000, 100) < 50
          ) {
            return true;
          }
        },
        x: 420,
        y: 500,
        text: "You win",
        fontSize: 44,
      },
    ],
  },
  "auto-construction-of-buildings": autoConstructionOfBuildings,
  "collision-blueprints": collisionBlueprints,
  "construction-of-buildings": constructionOfBuildings,
  "crafting-resources": craftingResources,
  "different-angles": differentAngles,
  "moving-blueprints": movingBlueprints,
  "moving-resources": movingResources,
  "multiple-construction-of-buildings": multipleConstructionOfBuildings,
  "multiple-construction-of-different-buildings":
    multipleConstructionOfDifferentBuildings,
  "showing-pointers": showingPointers,
  "production-resources": productionResources,
  "scene-render": sceneRender,
};

export function createTestBulding(
  buildingsLayer: Container,
  workersLayer: Container,
  tutorials: Tutorials,
  UIcontainer: Container,
  stage: Container,
) {
  addBuildMenu(UIcontainer);

  const scenarioName = getScenarioName();
  const scenario = scenarios[scenarioName];

  if (!scenario) {
    throw new Error("Scenario not found: " + scenarioName);
  }

  runScenario(scenario, buildingsLayer, workersLayer, tutorials);

  hideCrafts();

  stage.addChild(buildingsLayer);
  stage.addChild(workersLayer);
  stage.addChild(UIcontainer);
}

function runScenario(
  scenario: Scenario,
  buildingsLayer: Container,
  workersLayer: Container,
  tutorials: Tutorials,
) {
  const buildingsMap = new Map();

  for (const building of scenario.buildings) {
    if (building.from === "") {
      const newBuilding = addBuilding(
        building.x,
        building.y,
        buildingsLayer,
        building.type,
      );
      buildingsMap.set(building.id, newBuilding);
    } else {
      select(buildingsMap.get(building.from));
      const newBuilding = addBuilding(
        building.x,
        building.y,
        buildingsLayer,
        building.type,
      );
      buildingsMap.set(building.id, newBuilding);
    }
  }

  for (const resource of scenario.resources || []) {
    const newBuilding = buildingsMap.get(resource.buildingId);

    for (let i = 0; i < resource.count; i++) {
      const newResource = createResource(resource.type);
      newBuilding.tryToAddResource(newResource);
    }
  }

  for (const worker of scenario.workers || []) {
    const newBuilding = buildingsMap.get(worker.buildingId);
    const baseCenter = newBuilding.getBaseCenterInWorld();
    addWorker(
      baseCenter.x,
      baseCenter.y,
      workersLayer,
      newBuilding,
      worker.profession,
    );
  }

  for (const task of scenario.deliveryTasks || []) {
    const newBuilding = buildingsMap.get(task.target);
    addTask(
      newBuilding,
      JobType.delivering,
      task.priority,
      task.resource,
      task.count,
    );
  }

  for (const blueprint of scenario.buildingTasks || []) {
    select(buildingsMap.get(blueprint.from));
    addBlueprint(
      blueprint.x,
      blueprint.y,
      buildingsLayer,
      blueprint.buildingType,
    );
  }

  for (const pointers of scenario.pointers || []) {
    if (pointers.x && pointers.y) {
      tutorials.addNewPointerByCoordinates(
        pointers.condition,
        pointers.x,
        pointers.y,
      );
    } else if (pointers.findTarget) {
      tutorials.addNewPointerByTarget(pointers.condition, pointers.findTarget);
    }
  }

  for (const compass of scenario.compasses || []) {
    if (compass.findTarget) {
      tutorials.addNewCompass(compass.condition, compass.findTarget);
    }
  }

  for (const message of scenario.messages || []) {
    tutorials.addNewMessage(
      message.condition,
      message.x,
      message.y,
      message.text,
      message.fontSize,
    );
  }
}
