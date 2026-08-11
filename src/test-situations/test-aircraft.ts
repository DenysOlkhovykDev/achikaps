import { Container } from "pixi.js";

import { addWorker } from "@workers/_workers";
import { addBuilding, addBlueprint, select } from "@aircraft/aircraft";

import { JobType } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";

import { createResource } from "@resources/_resources";
import { AircraftScenario } from "./test-situation";

export function makeAirCraftByScenario(
  scenario: AircraftScenario,
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
}
