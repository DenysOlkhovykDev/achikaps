import { Container } from "pixi.js";
import { addBuildMenu, setIsBuildMode } from "@menus/build-menu";

import { addWorker } from "@workers/_workers";
import {
  addBuilding,
  addBlueprint,
  buildings,
  select,
} from "@buildings/_buildings";

import { JobType } from "@dashboard/task";
import { addTask, dashboard } from "@dashboard/_dashboard";

import { Iron } from "@resources/iron";
import { Meat } from "@resources/meat";
import { Perl } from "@resources/perl";
import { Battery } from "@resources/battery";
import { Gum } from "@resources/gum";
import { Gear } from "@resources/gear";
import { Arrow } from "@resources/arrow";

function getScenarioName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario") || "default";
}

type Scenario = {
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
    x: number;
    y: number;
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
};

const scenarios: Record<string, Scenario> = {
  default: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
  },
  "auto-construction-of-buildings": {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 300, y: 450 }],
    resources: [
      { buildingId: "p0", type: "Iron", count: 2 },
      { buildingId: "p0", type: "Perl", count: 2 },
    ],
    workers: [{ buildingId: "p0", x: 300, y: 450, profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 300,
        buildingType: "Platform",
      },
    ],
  },
  "collision-blueprints": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 505,
        y: 425,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 505,
        y: 475,
        buildingType: "Platform",
      },
    ],
  },
  "construction-of-buildings": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
    resources: [
      { buildingId: "p1", type: "Iron", count: 5 },
      { buildingId: "p2", type: "Perl", count: 5 },
    ],
    workers: [{ buildingId: "p0", x: 300, y: 450, profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 300,
        buildingType: "Platform",
      },
    ],
  },
  "crafting-resources": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "laboratory", type: "Laboratory", x: 500, y: 350 },
      { from: "p0", id: "factory", type: "Factory", x: 200, y: 350 },
      { from: "p0", id: "mine", type: "Mine", x: 300, y: 350 },
    ],
    resources: [
      { buildingId: "laboratory", type: "Iron", count: 1 },
      { buildingId: "laboratory", type: "Perl", count: 2 },
    ],
    workers: [
      { buildingId: "p0", x: 300, y: 450, profession: "production" },
      { buildingId: "p0", x: 300, y: 450, profession: "delivering" },
    ],
  },
  "moving-blueprints": {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 300, y: 450 }],
    buildingTasks: [
      {
        from: "p0",
        x: 305,
        y: 300,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 295,
        y: 300,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 295,
        y: 100,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 700,
        y: 450,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 300,
        y: 455,
        buildingType: "Platform",
      },
    ],
  },
  "moving-resources": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
    resources: [
      { buildingId: "p1", type: "Iron", count: 1 },
      { buildingId: "p2", type: "Perl", count: 1 },
    ],
    workers: [{ buildingId: "p0", x: 300, y: 450, profession: "delivering" }],
    deliveryTasks: [
      {
        target: "p2",
        priority: 5,
        resource: "Iron",
        count: 1,
      },
      {
        target: "p1",
        priority: 5,
        resource: "Perl",
        count: 1,
      },
    ],
  },
  "multiple-construction-of-buildings": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
    resources: [
      { buildingId: "p1", type: "Iron", count: 5 },
      { buildingId: "p2", type: "Perl", count: 5 },
    ],
    workers: [{ buildingId: "p0", x: 300, y: 450, profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 300,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 300,
        y: 600,
        buildingType: "Platform",
      },
    ],
  },
  "multiple-construction-of-different-buildings": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
    resources: [
      { buildingId: "p1", type: "Iron", count: 8 },
      { buildingId: "p2", type: "Perl", count: 2 },
      { buildingId: "p2", type: "Meat", count: 1 },
    ],
    workers: [{ buildingId: "p0", x: 300, y: 450, profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 300,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 300,
        y: 600,
        buildingType: "MeatGrinder",
      },
    ],
  },
  //working
  "production-resources": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 500, y: 500 },
      { from: "p0", id: "factory", type: "Factory", x: 300, y: 500 },
      { from: "p0", id: "farm", type: "Farm", x: 700, y: 500 },
      { from: "p0", id: "mine", type: "Mine", x: 500, y: 300 },
    ],
    workers: [
      { buildingId: "p0", x: 500, y: 500, profession: "production" },
      { buildingId: "p0", x: 500, y: 500, profession: "building" },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 500,
        y: 700,
        buildingType: "Platform",
      },
    ],
  },
  "scene-render": {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 500, y: 100 },
      { from: "p0", id: "factory", type: "Factory", x: 300, y: 100 },

      { from: "p0", id: "p1", type: "Platform", x: 500, y: 200 },
      { from: "p1", id: "mine", type: "Mine", x: 700, y: 200 },

      { from: "p1", id: "p2", type: "Platform", x: 500, y: 300 },
      { from: "p2", id: "farm", type: "Farm", x: 300, y: 300 },

      { from: "p2", id: "p3", type: "Platform", x: 500, y: 400 },
      { from: "p3", id: "house", type: "House", x: 700, y: 400 },

      { from: "p3", id: "p4", type: "Platform", x: 500, y: 500 },
      { from: "p4", id: "junkuard", type: "Junkuard", x: 300, y: 500 },

      { from: "p4", id: "p5", type: "Platform", x: 500, y: 600 },
      { from: "p5", id: "meat-grinder", type: "MeatGrinder", x: 700, y: 600 },

      { from: "p5", id: "p6", type: "Platform", x: 500, y: 700 },
      { from: "p6", id: "windmill", type: "Windmill", x: 300, y: 700 },

      { from: "p6", id: "p7", type: "Platform", x: 500, y: 800 },
      { from: "p7", id: "laboratory", type: "Laboratory", x: 700, y: 800 },

      { from: "p7", id: "p8", type: "Platform", x: 500, y: 900 },
      { from: "p8", id: "smelter", type: "Smelter", x: 300, y: 900 },
    ],
    resources: [
      { buildingId: "factory", type: "Perl", count: 5 },
      { buildingId: "mine", type: "Iron", count: 5 },
      { buildingId: "farm", type: "Meat", count: 5 },
      { buildingId: "windmill", type: "Battery", count: 5 },
      { buildingId: "laboratory", type: "Gum", count: 5 },
      { buildingId: "smelter", type: "Gear", count: 5 },
      { buildingId: "meat-grinder", type: "Arrow", count: 5 },
    ],
    workers: [{ buildingId: "p0", x: 500, y: 100, profession: "building" }],
  },
};

export function createTestBulding(
  buildingsLayer: Container,
  workersLayer: Container,
  stage: Container,
) {
  addBuildMenu(stage);
  setIsBuildMode(false);

  const scenarioName = getScenarioName();
  const scenario = scenarios[scenarioName];

  if (!scenario) {
    throw new Error("Scenario not found: " + scenarioName);
  }

  runScenario(scenario, buildingsLayer, workersLayer);

  setIsBuildMode(false);

  stage.addChild(buildingsLayer);
  stage.addChild(workersLayer);
}

function runScenario(
  scenario: Scenario,
  buildingsLayer: Container,
  workersLayer: Container,
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
    addWorker(worker.x, worker.y, workersLayer, newBuilding, worker.profession);
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
}

export function createResource(type: string) {
  switch (type) {
    case "Iron":
      return new Iron();
    case "Meat":
      return new Meat();
    case "Perl":
      return new Perl();
    case "Battery":
      return new Battery();
    case "Gum":
      return new Gum();
    case "Gear":
      return new Gear();
    case "Arrow":
      return new Arrow();
    default:
      throw new Error("Unknown resource: " + type);
  }
}
