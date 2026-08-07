import { Container } from "pixi.js";
import { Building } from "@buildings/building";
import { Road } from "@roads/road";
import { BlueprintRoad } from "@roads/blueprint-road";
import { JobType, Task } from "@dashboard/task";
import { addTask, deleteTask } from "@dashboard/_dashboard";

import { Platform } from "@buildings/platform";
import { Factory } from "@buildings/factory";
import { Mine } from "@buildings/mine";
import { Farm } from "@buildings/farm";
import { Grinder } from "@buildings/grinder";
import { Junkyard } from "@buildings/junkuard";
import { House } from "@buildings/house";
import { Laboratory } from "@buildings/laboratory";
import { Smelter } from "@buildings/smelter";
import { Engine } from "@buildings/engine";
import { Windmill } from "@buildings/windmill";
import { Blueprint } from "@buildings/blueprint";
import { ResourceType } from "@resources/resource-types";

type BuildingConstructor = new (x: number, y: number) => Building;
type BuildingParameters = {
  baseSize: number;
  minLinkLength: number;
  maxLinkLength: number;
  craft: { type: ResourceType; amount: number }[];
};

export const buildingMap = {
  Platform,
  Factory,
  Mine,
  Farm,
  Grinder,
  Junkyard,
  House,
  Laboratory,
  Smelter,
  Engine,
  Windmill,
} satisfies Record<string, BuildingConstructor>;

export type BuildingType = keyof typeof buildingMap;

export const buildingParameters = {
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
      { type: "Battery", amount: 1 },
    ],
  },
  Junkyard: {
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
} satisfies Record<string, BuildingParameters>;

export type BuildingKind = keyof typeof buildingParameters;

export const buildings: Building[] = [];
export const blueprints: Blueprint[] = [];
let selectedBuilding: number;

export function addBuilding(
  x: number,
  y: number,
  container: Container,
  buildingType: BuildingType,
) {
  const BuildingClass = buildingMap[buildingType];
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
  buildingType: BuildingType,
) {
  const blueprint = new Blueprint(x, y, buildingType);

  blueprints.push(blueprint);
  container.addChild(blueprint.root);

  if (buildings.length > 0) {
    const from = buildings[selectedBuilding];

    const line = new BlueprintRoad(from, blueprint);

    blueprint.addLinkedBuilding(line);

    container.addChildAt(line.graphic, 0);
    const craft = buildingParameters[buildingType].craft;

    for (let i = 0; i < craft.length; i++) {
      for (let j = 0; j < craft[i].amount; j++) {
        const task = addTask(
          from,
          JobType.building,
          5,
          craft[i].type,
          j + 1,
        );
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
    blueprint.blueprintToBuilding(container);
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
  blueprint.unsubscribe?.();
  blueprint.unsubscribe = undefined;

  for (const task of blueprint.tasks) {
    deleteTask(task);
  }
  blueprint.tasks = [];

  for (const link of blueprint.links) {
    link.graphic.destroy();
  }
  blueprint.root.destroy();

  const index = blueprints.indexOf(blueprint);
  if (index !== -1) {
    blueprints.splice(index, 1);
  }
}
