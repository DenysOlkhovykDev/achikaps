import { aircraft } from "@aircraft/aircraft";

import { JobType } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";

import { createResource } from "@resources/_resources";
import { AircraftScenario } from "./test-situation";

export function createAirCraftByScenario(scenario: AircraftScenario) {
  const buildingsMap = new Map();

  for (const building of scenario.buildings) {
    if (building.from === "") {
      const newBuilding = aircraft.addBuilding(
        building.x,
        building.y,
        building.type,
      );
      buildingsMap.set(building.id, newBuilding);
    } else {
      aircraft.selectBuilding(buildingsMap.get(building.from));
      const newBuilding = aircraft.addBuilding(
        building.x,
        building.y,
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
    aircraft.workers.addWorker(
      baseCenter.x,
      baseCenter.y,
      aircraft.workersLayer,
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
    aircraft.selectBuilding(buildingsMap.get(blueprint.from));
    aircraft.addBlueprint(blueprint.x, blueprint.y, blueprint.buildingType);
  }
}
