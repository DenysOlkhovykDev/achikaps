import { Application, Text } from "pixi.js";

const app = new Application();

await app.init({
  width: 1000,
  height: 1000,
  background: "#c6c6c6", 
});

document.body.appendChild(app.canvas);

const text = new Text({
  text: "Hello World",
  style: {
    fill: "#ffffff",
    fontSize: 36,
  },
});

text.x = 400;
text.y = 450;

app.stage.addChild(text);