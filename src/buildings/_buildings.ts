import { Container } from "pixi.js";
import { Building } from "@buildings/building";
import { Road } from "@roads/road";
import { BlueprintRoad } from "@roads/blueprint-road";
import { JobType, Task } from "@dashboard/task";
import { addTask } from "@dashboard/_dashboard";
import { dashboard } from "@dashboard/_dashboard";
import { Resource } from "@resources/resource";

import { Platform } from "@buildings/platform";
import { Factory } from "@buildings/factory";
import { Mine } from "@buildings/mine";
import { Farm } from "@buildings/farm";
import { Grinder } from "@buildings/grinder";
import { Junkuard } from "@buildings/junkuard";
import { House } from "@buildings/house";
import { Windmill } from "@buildings/windmill";
import { Laboratory } from "@buildings/laboratory";
import { Smelter } from "@buildings/smelter";
import { Engine } from "@buildings/engine";
import { Blueprint } from "@buildings/blueprint";

type BuildingConstructor = new (x: number, y: number) => Building;

export const buildingMap: Record<string, BuildingConstructor> = {
  Platform,
  Factory,
  Mine,
  Farm,
  Grinder,
  Junkuard,
  House,
  Windmill,
  Laboratory,
  Smelter,
  Engine,
};

export const buidingParameters = {
  Blueprint: { baseSize: 0, minLinkLength: 120, maxLinkLength: 200, craft: [] },
  Platform: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 1 },
      { type: "Perl", amount: 1 },
    ],
  },
  Factory: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 2 },
      { type: "Perl", amount: 1 },
    ],
  },
  Mine: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [{ type: "Iron", amount: 3 }],
  },
  Farm: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 1 },
      { type: "Perl", amount: 2 },
    ],
  },
  Grinder: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 3 },
      { type: "Meat", amount: 1 },
    ],
  },
  Laboratory: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 2 },
      { type: "Meat", amount: 1 },
      { type: "Perl", amount: 1 },
    ],
  },
  Smelter: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 2 },
      { type: "Perl", amount: 2 },
    ],
  },
  Engine: {
    baseSize: 20,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Gum", amount: 1 },
      { type: "Gear", amount: 1 },
      { type: "Truss", amount: 1 },
    ],
  },
  Junkuard: {
    baseSize: 60,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 5 },
      { type: "Perl", amount: 2 },
    ],
  },
  House: {
    baseSize: 25,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 1 },
      { type: "Perl", amount: 5 },
    ],
  },
  Windmill: {
    baseSize: 40,
    minLinkLength: 120,
    maxLinkLength: 200,
    craft: [
      { type: "Iron", amount: 6 },
      { type: "Perl", amount: 1 },
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

  buildings.push(building);
  container.addChild(building.root);

  if (buildings.length > 1) {
    const from = buildings[selectedBuilding];
    const to = buildings[buildings.length - 1];

    const line = new Road(from, to);

    from.addLinkedBuilding(line);
    to.addLinkedBuilding(line);

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

    const line = new BlueprintRoad(from, blueprint);

    blueprint.addLinkedBuilding(line);

    container.addChildAt(line.graphic, 0);
    const craft =
      buidingParameters[buildingType as keyof typeof buidingParameters].craft;

    for (let i = 0; i < craft.length; i++) {
      for (let j = 0; j < craft[i].amount; j++) {
        const task = addTask(from, JobType.building, 5, craft[i].type, 1);
        if (task) {
          blueprint.tasks.push(task);
        }
        blueprint.buildResources.push(craft[i].type);
      }
    }

    const source = blueprint.links[0].from;

    const unsubscribe = source.onResourceAdded((task: Task) => {
      blueprint.onBlueprintResourceAdded(task, container);
    });

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
      for (const link of blueprints[i].links) {
        link.graphic.destroy();
      }
      blueprints[i].root.destroy();
      blueprints.splice(i, 1);
    }
  }
}

export function deleteBlueprint(blueprint: Blueprint) {
  blueprint.unsubscribe?.();
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
