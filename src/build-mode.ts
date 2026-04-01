import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { createMenu } from "./build-menu";
import { setBuildingType } from "./main";

let isBuildMode = false;
const greenPlus = new Graphics();

const menuData = [
  {
    label: "Platform",
    color: "#acacac",
    onClick: () => setBuildingType("#acacac"),
  },
  {
    label: "Factory",
    color: "#a8d0db",
    onClick: () => setBuildingType("#a8d0db"),
  },
  {
    label: "Mine",
    color: "#d6d1a8",
    onClick: () => setBuildingType("#d6d1a8"),
  },
  {
    label: "Farm",
    color: "#dba8a8",
    onClick: () => setBuildingType("#dba8a8"),
  },
];

export function addPlus(container: Container) {
  const centerX = 500;
  const centerY = 950;

  greenPlus
    .moveTo(centerX - 25, centerY)
    .lineTo(centerX + 25, centerY)
    .moveTo(centerX, centerY - 25)
    .lineTo(centerX, centerY + 25)
    .stroke({ width: 6, color: "#00ff60" });

  greenPlus.eventMode = "static";

  greenPlus.on("pointerdown", (event) => {
    greenPlusOnClick(event, container);
  });

  container.addChild(greenPlus);
  greenPlus.visible = isBuildMode;
}

export function setBuildMode(buildMode: boolean) {
  isBuildMode = buildMode;

  if (greenPlus) {
    greenPlus.visible = buildMode;
  }
}

export function getBuildMode() {
  return isBuildMode;
}

function greenPlusOnClick(event: FederatedPointerEvent, container: Container) {
  event.stopPropagation();

  const menu = createMenu(menuData, 400, 1000 - 50 * menuData.length);

  container.addChild(menu);
}
