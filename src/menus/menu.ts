import { buildingMap, buidingParameters } from "@aircraft/aircraft";
import { Container, Graphics, Text } from "pixi.js";
import { Platform } from "@aircraft/platform";
import { Building } from "@aircraft/building";
import { RecipeSign } from "@aircraft/building-parts.ts/recipe-sign";

export interface MenuItem {
  label: string;
  color: string;
  onClick?: () => void;
}

export class Menu {
  container = new Container();

  private columns = 3;
  private gap = 10;

  private width = 120;
  private height = 120;

  private x = 500;
  private y = 980;

  constructor(private items: MenuItem[]) {
    this.container.addChild(this.drawBackground());

    this.items.forEach((item, index) => {
      this.drawItem(item, index);
    });

    const rows = Math.ceil(this.items.length / this.columns);

    const totalWidth =
      this.columns * this.width + (this.columns - 1) * this.gap;

    const totalHeight = rows * this.height + (rows - 1) * this.gap;

    this.container.x = this.x - totalWidth / 2;
    this.container.y = this.y - totalHeight;
  }

  private drawBackground() {
    const rows = Math.ceil(this.items.length / this.columns);

    const bgWidth = this.columns * this.width + (this.columns - 1) * this.gap;

    const bgHeight = rows * this.height + (rows - 1) * this.gap;

    return new Graphics()
      .roundRect(-10, -10, bgWidth + 20, bgHeight + 20, 10)
      .fill("#cfcbc8");
  }

  private drawItem(item: MenuItem, index: number) {
    const column = index % this.columns;
    const row = Math.floor(index / this.columns);

    const xOffset = column * (this.width + this.gap);
    const yOffset = row * (this.height + this.gap);

    const background = new Graphics()
      .roundRect(xOffset, yOffset, this.width, this.height, 8)
      .fill(item.color);

    background.eventMode = "static";
    background.cursor = "pointer";

    background.on("pointerdown", (e) => {
      e.stopPropagation();

      item.onClick?.();

      this.menuHide();
    });
    this.container.addChild(background);

    const text = new Text({
      text: item.label,
      style: {
        fill: "#000000",
        fontSize: 20,
      },
    });

    text.anchor.set(0.5);

    text.x = xOffset + this.width / 2;
    text.y = yOffset + 18;

    text.eventMode = "none";
    this.container.addChild(text);

    const BuildingClass = buildingMap[item.label] || Platform;
    const building = new BuildingClass(
      xOffset + this.width / 2,
      yOffset + this.height / 2,
    );

    building.root.scale = 0.5;

    this.drawBuildingRecipe(building, xOffset, yOffset);
    this.drawCraftRecipe(building, xOffset, yOffset);

    building.root.eventMode = "none";

    this.container.addChild(building.root);
  }

  private drawCraftRecipe(building: Building, x: number, y: number) {
    if (building.craft) {
      building.showRecipeInfo();

      building.recipeSign.root.position.set(
        x + this.width / 2,
        y + this.height - 18,
      );

      this.container.addChild(building.recipeSign.root);
    }
  }

  private drawBuildingRecipe(building: Building, x: number, y: number) {
    const buildingRecipe =
      buidingParameters[building.buildingType as keyof typeof buidingParameters]
        .craft;

    const recipeSign = new RecipeSign();
    recipeSign.show(
      {
        ingredients: buildingRecipe.map((ingredient) => ({
          resourceName: ingredient.type,
          count: ingredient.amount,
        })),
      },
      { layout: "vertical" },
    );
    recipeSign.root.position.set(x + this.width - 31, y + this.height - 90);

    this.container.addChild(recipeSign.root);
  }

  menuShow(parent: Container) {
    parent.addChild(this.container);
  }

  menuHide() {
    this.container.parent?.removeChild(this.container);
  }
}
