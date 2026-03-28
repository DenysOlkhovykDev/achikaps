import { Container, Graphics } from "pixi.js";

let isBuildMode = false;
const greenPlus = new Graphics();

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

  greenPlus.on("pointerdown", () => {
    console.log("greenPlus");
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
