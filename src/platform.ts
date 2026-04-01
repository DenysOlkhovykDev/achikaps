import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { setBuildMode } from "./build-mode";

export type Platform = {
  graphic: Graphics;
  isSelected: boolean;
  color: string;
  index: number;
  coordinates: {
    x: number;
    y: number;
  };
  links: Platform[];
};

export const platforms: Platform[] = [];

export function addPlatform(
  x: number,
  y: number,
  color: string,
  container: Container,
) {
  const graphic = new Graphics();

  const platform: Platform = {
    graphic: makeGraphic(graphic, x, y, color),
    isSelected: false,
    color,
    index: platforms.length,
    coordinates: {
      x: x,
      y: y,
    },
    links: [],
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
    const prev = platforms[prevSelected];

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

    platform.links.push(prev);
    prev.links.push(platform);

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

export function selectPlatform(selected: number) {
  platforms.forEach((element) => {
    element.isSelected = false;

    element.graphic = makeGraphic(
      element.graphic,
      element.coordinates.x,
      element.coordinates.y,
      element.color,
    );
  });
  if (selected !== -1) {
    platforms[selected].isSelected = true;

    platforms[selected].graphic = makeGraphic(
      platforms[selected].graphic,
      platforms[selected].coordinates.x,
      platforms[selected].coordinates.y,
      "#e8ff95",
    );
  }
}

export function getNextPlatform(
  current: Platform,
  prev?: Platform,
): Platform | undefined {
  if (current.links.length === 0) return undefined;

  // всі варіанти окрім попереднього
  const options = current.links.filter((p) => p !== prev);

  // якщо є куди йти — йдемо туди
  if (options.length > 0) {
    return options[Math.floor(Math.random() * options.length)];
  }

  // 🔴 якщо ні — повертаємось назад
  return prev ?? undefined;
}
