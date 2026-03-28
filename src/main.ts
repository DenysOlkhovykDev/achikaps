import { Application } from "pixi.js";
import { circles, addCircle } from "./circle";

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
  const { x, y } = event.global;

  addCircle(x, y);

  app.stage.addChild(circles[circles.length - 1]);
});
