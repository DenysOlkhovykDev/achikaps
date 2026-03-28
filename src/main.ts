import { Application } from "pixi.js";
import { addPlatform } from "./platform";
import { setBuildMode, getBuildMode, addPlus } from "./build-mode";

const app = new Application();

await app.init({
  width: 1000,
  height: 1000,
  background: "#e5ecea",
});

document.body.appendChild(app.canvas);

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

app.stage.on("pointerdown", (event) => {
  if (getBuildMode()) {
    const { x, y } = event.global;
    addPlatform(x, y, app.stage);
  }
});

addPlus(app.stage);
addPlatform(500, 400, app.stage);
