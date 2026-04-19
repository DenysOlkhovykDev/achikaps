import { Container, Graphics } from "pixi.js";
import { MenuTrigger } from "@menus/menu-trigger";
import { MenuItem } from "@menus/menu";

let isBuildMode = false;
let menuTrigger: MenuTrigger;
let buildingType = "";

const menuData: MenuItem[] = [
  {
    label: "Platform",
    color: "#acacac",
    onClick: () => setBuildingType("Platform"),
  },
  {
    label: "Factory",
    color: "#a8d0db",
    onClick: () => setBuildingType("Factory"),
  },
  {
    label: "Mine",
    color: "#d6d1a8",
    onClick: () => setBuildingType("Mine"),
  },
  {
    label: "Farm",
    color: "#dba8a8",
    onClick: () => setBuildingType("Farm"),
  },
  {
    label: "Junkuard",
    color: "#b7b697",
    onClick: () => setBuildingType("Junkuard"),
  },
  {
    label: "MeatGrinder",
    color: "#c0ac9a",
    onClick: () => setBuildingType("MeatGrinder"),
  },
  {
    label: "House",
    color: "#a4bc9a",
    onClick: () => setBuildingType("House"),
  },
  {
    label: "Windmill",
    color: "#c5cade",
    onClick: () => setBuildingType("Windmill"),
  },
  {
    label: "Laboratory",
    color: "#caa5c3",
    onClick: () => setBuildingType("Laboratory"),
  },
  {
    label: "Smelter",
    color: "#dba8a8",
    onClick: () => setBuildingType("Smelter"),
  },
  {
    label: "Engine",
    color: "#a8b1db",
    onClick: () => setBuildingType("Engine"),
  },
];

export function addBuildMenu(container: Container) {
  const x = 500;
  const y = 950;

  const graphic = new Graphics()
    .moveTo(x - 25, y)
    .lineTo(x + 25, y)
    .moveTo(x, y - 25)
    .lineTo(x, y + 25)
    .stroke({ width: 16, color: "#00ff60" });

  menuTrigger = new MenuTrigger(x, y, menuData, 200, 50, graphic, container);
}

export function setIsBuildMode(type: boolean) {
  isBuildMode = type;
  if (isBuildMode) {
    menuTrigger.menuTriggershow();
  } else {
    menuTrigger.menuTriggerHide();
  }
}

export function getIsBuildMode() {
  return isBuildMode;
}

export function setBuildingType(type: string) {
  buildingType = type;
}

export function getBuildingType() {
  return buildingType;
}
