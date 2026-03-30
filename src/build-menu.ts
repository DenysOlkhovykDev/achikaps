import { Container, Graphics, Text } from "pixi.js";

interface MenuItem {
  label: string;
  color: string;
  onClick?: () => void;
}

const itemHeight = 40;
const width = 200;

export function createMenu(items: MenuItem[], x: number, y: number) {
  const menu = new Container();

  menu.addChild(drawMenuBackground(items.length));

  drawMenuItems(items, menu);

  menu.x = x;
  menu.y = y;

  return menu;
}

function drawMenuBackground(numberOfMenuElements: number) {
  return new Graphics()
    .rect(-10, -10, width + 20, (itemHeight + 10) * numberOfMenuElements + 10)
    .fill("#cfcbc8");
}

function drawMenuItems(items: MenuItem[], menu: Container) {
  items.forEach((item, index) => {
    const yOffset = index * (itemHeight + 10);

    const backgroundMenuElement = new Graphics()
      .rect(0, yOffset, width, itemHeight)
      .fill(item.color);

    backgroundMenuElement.eventMode = "static";
    backgroundMenuElement.cursor = "pointer";

    const menuText = new Text({
      text: item.label,
      style: {
        fill: "#000000",
        fontSize: 16,
      },
    });

    menuText.x = 10;
    menuText.y = yOffset + 10;

    backgroundMenuElement.on("pointerdown", (e) => {
      e.stopPropagation();
      item.onClick?.();
      menu.parent?.removeChild(menu);
    });

    menu.addChild(backgroundMenuElement, menuText);
  });
}
