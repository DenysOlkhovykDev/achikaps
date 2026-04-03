import { Container } from "pixi.js";
import { Building } from "./building";
import { Road } from "../roads/road";
import { setIsBuildMode } from "../menus/build-menu";

import { Platform } from "./platform";
import { Factory } from "./factory";
import { Mine } from "./mine";
import { Farm } from "./farm";

type BuildingConstructor = new (x: number, y: number) => Building;

const buildingMap: Record<string, BuildingConstructor> = {
  Platform,
  Factory,
  Mine,
  Farm,
};

export const buildings: Building[] = [];
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

    from.addLinkedBuilding(to);
    to.addLinkedBuilding(from);

    container.addChildAt(line.graphic, 0);
  }
}

export function select(node: Building) {
  selectedBuilding = buildings.indexOf(node);
  setIsBuildMode(true);
}

export function getNextBuilding(
  current: Building,
  prev?: Building,
): Building | undefined {
  if (current.links.length === 0) return undefined;

  const options = current.links.filter((p) => p !== prev);

  if (options.length > 0) {
    return options[Math.floor(Math.random() * options.length)];
  }

  return prev ?? undefined;
}
