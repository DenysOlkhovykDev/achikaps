import { Container } from "pixi.js";
import { Building } from "@aircraft/building";
import { Road } from "@roads/road";
import { BlueprintRoad } from "@roads/blueprint-road";
import { JobType, Task } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";
import { Resource } from "@resources/resource";

import { Platform } from "@aircraft/platform";
import { Factory } from "@aircraft/factory";
import { Mine } from "@aircraft/mine";
import { Farm } from "@aircraft/farm";
import { Grinder } from "@aircraft/grinder";
import { Junkuard } from "@aircraft/junkuard";
import { House } from "@aircraft/house";
import { Laboratory } from "@aircraft/laboratory";
import { Smelter } from "@aircraft/smelter";
import { Engine } from "@aircraft/engine";
import { Blueprint } from "@aircraft/blueprint";
import { GlassMaker } from "@aircraft/glassMaker";

type BuildingConstructor = new (x: number, y: number) => Building;

const centeredGeometry = (baseRadius: number, decorativeRadius: number) => ({
  baseRadius,
  decorativeRadius: decorativeRadius,
  baseCenter: { x: 0, y: 0 },
  decorativeCenter: { x: 0, y: 0 },
});

export const buildingMap: Record<string, BuildingConstructor> = {
  Platform,
  Factory,
  Mine,
  Farm,
  Grinder,
  Junkuard,
  House,
  Laboratory,
  Smelter,
  Engine,
  GlassMaker,
};

export const buidingParameters = {
  Blueprint: {
    ...centeredGeometry(0, 0),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [],
  },
  Platform: {
    ...centeredGeometry(40, 40),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 1 },
      { type: "Water", amount: 1 },
    ],
  },
  Factory: {
    ...centeredGeometry(40, 45),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 2 },
      { type: "Water", amount: 1 },
    ],
  },
  Mine: {
    ...centeredGeometry(40, 43),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [{ type: "Organic", amount: 3 }],
  },
  Farm: {
    ...centeredGeometry(40, 43),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 1 },
      { type: "Water", amount: 2 },
    ],
  },
  Grinder: {
    ...centeredGeometry(40, 43),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 3 },
      { type: "Metal", amount: 1 },
    ],
  },
  Laboratory: {
    ...centeredGeometry(40, 45),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 2 },
      { type: "Metal", amount: 1 },
      { type: "Water", amount: 1 },
    ],
  },
  Smelter: {
    ...centeredGeometry(40, 50),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 2 },
      { type: "Water", amount: 2 },
    ],
  },
  Engine: {
    ...centeredGeometry(20, 27),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Gum", amount: 1 },
      { type: "Gear", amount: 1 },
      { type: "Truss", amount: 1 },
    ],
  },
  Junkuard: {
    ...centeredGeometry(60, 60),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 5 },
      { type: "Water", amount: 2 },
    ],
  },
  House: {
    ...centeredGeometry(25, 30),
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 1 },
      { type: "Water", amount: 5 },
    ],
  },
  GlassMaker: {
    baseRadius: 20,
    decorativeRadius: 35,
    baseCenter: { x: 0, y: 0 },
    decorativeCenter: { x: 15, y: 0 },
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Organic", amount: 1 },
      { type: "Water", amount: 2 },
      { type: "Metal", amount: 3 },
    ],
  },
};

export const buildings: Building[] = [];
export const blueprints: Blueprint[] = [];
let selectedBuilding: number;

export function addBuilding(
  x: number,
  y: number,
  container: Container,
  buildingType: string,
) {
  const BuildingClass = buildingMap[buildingType] || Platform;
  const building = new BuildingClass(x, y);
  const from = buildings.length > 0 ? buildings[selectedBuilding] : undefined;

  if (from) {
    building.orientByBuildDirection(from);
  }

  buildings.push(building);
  container.addChild(building.root);

  if (from) {
    const line = new Road(from, building);

    from.addLinkedBuilding(line);
    building.addLinkedBuilding(line);

    container.addChildAt(line.graphic, 0);
  }

  return building;
}

export function addBlueprint(
  x: number,
  y: number,
  container: Container,
  buildingType: string,
) {
  const blueprint = new Blueprint(x, y, buildingType);

  blueprints.push(blueprint);
  container.addChild(blueprint.root);

  if (buildings.length > 0) {
    const from = buildings[selectedBuilding];

    blueprint.orientByBuildDirection(from);

    const line = new BlueprintRoad(from, blueprint);

    blueprint.addLinkedBuilding(line);

    container.addChildAt(line.graphic, 0);
    const craft =
      buidingParameters[buildingType as keyof typeof buidingParameters].craft;

    for (let i = 0; i < craft.length; i++) {
      for (let j = 0; j < craft[i].amount; j++) {
        const availableResource = from.recources.find(
          (resource) =>
            resource.resourceType === craft[i].type && !resource.isReserved,
        );

        if (availableResource) {
          blueprint.reserveBuildResource(availableResource);
        } else {
          const task = addTask(from, JobType.building, 5, craft[i].type, 1);
          if (task) {
            blueprint.tasks.push(task);
          }
        }

        blueprint.buildResources.push(craft[i].type);
      }
    }

    from.refreshTasks();

    const source = blueprint.links[0].from;

    const unsubscribe = source.onResourceAdded(
      (task: Task, resource: Resource) => {
        blueprint.onBlueprintResourceAdded(task, resource, container);
      },
    );

    blueprint.unsubscribe = unsubscribe;
    blueprint.blueprinToBuilding(container);
  }

  return blueprint;
}

export function select(node: Building) {
  selectedBuilding = buildings.indexOf(node);
  showCrafts();
}

export function deSelectAllBuildings() {
  for (const building of buildings) {
    building.selectShadowContainer.removeChildren();
  }

  for (const blueprint of blueprints) {
    blueprint.selectShadowContainer.removeChildren();
  }
}

export function showCrafts() {
  hideCrafts();
  for (const blueprint of blueprints) {
    blueprint.showCraft();
  }
}

export function hideCrafts() {
  for (const building of buildings) {
    building.hideCraftSign();
  }
  for (const blueprint of blueprints) {
    blueprint.hideCraftSign();
  }
}

export function animations(delta: number, movingAngle?: number) {
  for (const building of buildings) {
    building.animation(delta, movingAngle);
  }
}

export function movingBlueprints(delta: number) {
  for (const blueprint of blueprints) {
    for (const building of buildings) {
      blueprint.checkAndMove(building, delta);
    }
  }
  for (const blueprint of blueprints) {
    for (const blueprintForCheck of blueprints) {
      if (blueprint !== blueprintForCheck) {
        blueprint.checkAndMove(blueprintForCheck, delta);
      }
    }
  }

  for (let i = blueprints.length - 1; i >= 0; i--) {
    if (blueprints[i].redraws > 5000) {
      deleteBlueprint(blueprints[i]);
    }
  }
}

export function deleteBlueprint(blueprint: Blueprint) {
  blueprint.cleanup();
  let index = -1;
  for (let i = 0; i < blueprints.length; i++) {
    if (blueprints[i] === blueprint) {
      index = i;
    }
  }
  for (const link of blueprint.links) {
    link.graphic.destroy();
  }
  blueprint.root.destroy();

  if (index !== -1) {
    blueprints.splice(index, 1);
  }
}
