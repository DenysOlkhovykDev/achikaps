import { Application } from "pixi.js";
import { addPlatform, selectPlatform } from "./platform";
import { setBuildMode, getBuildMode, addPlus } from "./build-mode";

const app = new Application();

let buildingColor: string;

await app.init({
  width: 1000,
  height: 1000,
  background: "#e5ecea",
});

document.body.appendChild(app.canvas);

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

app.stage.on("pointerdown", (event) => {
  if (getBuildMode() && getBuildingType() !== "") {
    const { x, y } = event.global;
    addPlatform(x, y, buildingColor, app.stage);
    selectPlatform(-1);
    setBuildingType("");
    setBuildMode(false);
  }
});

addPlus(app.stage);
addPlatform(500, 400, "#acacac", app.stage);

export function setBuildingType(type: string) {
  buildingColor = type;
}

export function getBuildingType() {
  return buildingColor;
}
