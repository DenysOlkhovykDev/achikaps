import { Container, Graphics } from "pixi.js";
import { MenuTrigger } from "@menus/menu-trigger";
import { MenuItem } from "@menus/menu";
import { BuildingType } from "@buildings/_buildings";

let isBuildMode = false;
let menuTrigger: MenuTrigger;
let buildingType: BuildingType | "" = "";

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
  {
    label: "Windmill",
    color: "#88b9ac",
    onClick: () => setBuildingType("Windmill"),
  },
  {
    label: "Recycler",
    color: "#8fb7a0",
    onClick: () => setBuildingType("Recycler"),
  },
  {
    label: "Glassworks",
    color: "#7fb9c4",
    onClick: () => setBuildingType("Glassworks"),
  },
  {
    label: "Workshop",
    color: "#b88ca5",
    onClick: () => setBuildingType("Workshop"),
  },
  {
    label: "ArmorPress",
    color: "#806c78",
    onClick: () => setBuildingType("ArmorPress"),
  },
  {
    label: "Forge",
    color: "#9b6845",
    onClick: () => setBuildingType("Forge"),
  },
  {
    label: "Collector",
    color: "#8099a4",
    onClick: () => setBuildingType("Collector"),
  },
  {
    label: "Loom",
    color: "#9684b4",
    onClick: () => setBuildingType("Loom"),
  },
  {
    label: "Cannon",
    color: "#687980",
    onClick: () => setBuildingType("Cannon"),
  },
  {
    label: "MachineGun",
    color: "#596a71",
    onClick: () => setBuildingType("MachineGun"),
  },
  {
    label: "Saw",
    color: "#71858b",
    onClick: () => setBuildingType("Saw"),
  },
  {
    label: "Manipulator",
    color: "#d29d45",
    onClick: () => setBuildingType("Manipulator"),
  },
  {
    label: "House",
    color: "#72ac4a",
    onClick: () => setBuildingType("House"),
  },
  {
    label: "Junkyard",
    color: "#cac8a5",
    onClick: () => setBuildingType("Junkyard"),
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

export function setBuildingType(type: BuildingType | "") {
  buildingType = type;
}

export function getBuildingType() {
  return buildingType;
}

export function getIsMenuActive() {
  return menuTrigger.isMenuActive;
}
