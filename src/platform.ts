import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { setBuildMode } from "./build-mode";

type Platform = {
  graphic: Graphics;
  isSelected: boolean;
  index: number;
  coordinates: {
    x: number;
    y: number;
  };
};

const platforms: Platform[] = [];

export function addPlatform(x: number, y: number, container: Container) {
  const graphic = new Graphics();

  const platform: Platform = {
    graphic: makeGraphic(graphic, x, y, "#acacac"),
    isSelected: false,
    index: platforms.length,
    coordinates: {
      x: x,
      y: y,
    },
  };

  const prevSelected = platforms.findIndex((element) => {
    if (element.isSelected === true) {
      return element;
    }
  });

  platform.graphic.on("pointerdown", (event) => {
    platformOnClick(event, platform);
  });

  platforms.push(platform);

  if (prevSelected !== -1) {
    const line = new Graphics()
      .moveTo(
        platforms[prevSelected].coordinates.x,
        platforms[prevSelected].coordinates.y,
      )
      .lineTo(
        platforms[platform.index].coordinates.x,
        platforms[platform.index].coordinates.y,
      )
      .stroke({ width: 6, color: "#000000" });
    container.addChildAt(line, 0);
  }

  container.addChild(platform.graphic);
}

function platformOnClick(event: FederatedPointerEvent, platform: Platform) {
  selectPlatform(platform.index);

  setBuildMode(true);
  event.stopPropagation();
}

function makeGraphic(graphic: Graphics, x: number, y: number, color: string) {
  graphic.clear();

  graphic
    .circle(x, y, 20)
    .stroke({
      width: 2,
      color: "#000000",
    })
    .fill(color);

  graphic.eventMode = "static";

  return graphic;
}

function selectPlatform(selected: number) {
  platforms.forEach((element) => {
    element.isSelected = false;

    element.graphic = makeGraphic(
      element.graphic,
      element.coordinates.x,
      element.coordinates.y,
      "#acacac",
    );
  });
  platforms[selected].isSelected = true;

  platforms[selected].graphic = makeGraphic(
    platforms[selected].graphic,
    platforms[selected].coordinates.x,
    platforms[selected].coordinates.y,
    "#c57575",
  );
}
