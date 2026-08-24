import { Container, Graphics } from "pixi.js";
import { MenuTrigger } from "@build-menu/menu-trigger";
import { MenuItem } from "@build-menu/menu";

let isBuildMode = false;
let menuTrigger: MenuTrigger;
let buildingType: string | undefined = undefined;

const menuData: MenuItem[] = [
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
    label: "Grinder",
    color: "#c0ac9a",
    onClick: () => setBuildingType("Grinder"),
  },
  {
    label: "Laboratory",
    color: "#caa5c3",
    onClick: () => setBuildingType("Laboratory"),
  },
  {
    label: "Smelter",
    color: "#aadba8",
    onClick: () => setBuildingType("Smelter"),
  },
  {
    label: "Platform",
    color: "#acacac",
    onClick: () => setBuildingType("Platform"),
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

  menuTrigger = new MenuTrigger(menuData, graphic, container);
}

export function showBuildMenuTrigger() {
  menuTrigger.menuTriggerShow();
  isBuildMode = true;
}

export function hideBuildMenuTrigger() {
  menuTrigger.menuTriggerHide();
  isBuildMode = false;
}

export function isVisibleBuildMenuTrigger() {
  return isBuildMode;
}

export function setBuildingType(type: string | undefined) {
  buildingType = type;
}

export function getBuildingType() {
  return buildingType;
}

export function getIsMenuActive() {
  return menuTrigger.isMenuActive;
}
