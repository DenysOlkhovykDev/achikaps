import { Container, Graphics, FederatedPointerEvent } from "pixi.js";
import { Platform, getNextPlatform } from "./platform";

type Human = {
  graphic: Graphics;
  jobColor: string;
  index: number;
  coordinates: {
    x: number;
    y: number;
  };
  speed: number;
  currentPlatform: Platform;
  targetPlatform?: Platform;
  previousPlatform?: Platform;
};

const humans: Human[] = [];

export function addHuman(
  x: number,
  y: number,
  jobColor: string,
  container: Container,
  currentPlatform: Platform,
) {
  const graphic = new Graphics();

  const human: Human = {
    graphic: makeGraphic(graphic, x, y, jobColor),
    jobColor,
    index: humans.length,
    coordinates: {
      x: x,
      y: y,
    },
    speed: 1 + Math.random() * 2,
    currentPlatform: currentPlatform,
  };

  humans.push(human);

  console.log(human);

  container.addChild(human.graphic);
}

function makeGraphic(graphic: Graphics, x: number, y: number, color: string) {
  graphic.clear();

  graphic
    .circle(0, 0, 4)
    .stroke({
      width: 2,
      color: "#000000",
    })
    .fill(color);

  graphic.position.set(x, y);

  graphic.eventMode = "static";

  return graphic;
}

export function updateHumans() {
  for (const human of humans) {
    if (!human.targetPlatform) {
      human.targetPlatform = getNextPlatform(human.currentPlatform);
    } else {
      const target = human.targetPlatform.coordinates;

      const dx = target.x - human.coordinates.x;
      const dy = target.y - human.coordinates.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      // Якщо дійшов
      if (distance < 3) {
        human.previousPlatform = human.currentPlatform;
        human.currentPlatform = human.targetPlatform!;

        human.targetPlatform = getNextPlatform(
          human.currentPlatform,
          human.previousPlatform,
        );
      }

      // Нормалізація вектора
      const vx = dx / distance;
      const vy = dy / distance;

      // Рух
      human.coordinates.x += vx * human.speed;
      human.coordinates.y += vy * human.speed;

      // Оновлення графіки
      human.graphic.position.set(human.coordinates.x, human.coordinates.y);
    }
  }
}
