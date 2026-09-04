import { buildingMap } from "@aircraft/aircraft";
import { Container, Graphics, Text } from "pixi.js";
import { Platform } from "@aircraft/platform";
import { Building } from "@aircraft/building";
import { RecipeSign } from "@aircraft/building-parts/recipe-sign";
import { gameScreen } from "../../game-config";

export interface MenuItem {
  label: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Collector",
    color: "#a8d0db",
  },
  {
    label: "Farm",
    color: "#bad895",
  },
  {
    label: "Extractor",
    color: "#dba8a8",
  },
  {
    label: "Assembler",
    color: "#d6de90",
  },
  {
    label: "Mixer",
    color: "#caa5c3",
  },
  {
    label: "Grinder",
    color: "#b7ded3",
  },
  {
    label: "Platform",
    color: "#acacac",
  },
  {
    label: "Engine",
    color: "#a8b1db",
  },
];

export class ConstructionMenu extends Container {
  private menuContainer = new Container();
  private menuBackground = new Graphics();
  private menuItemsContainers: Container[] = [];

  private columnWidth = 120;
  private columnHeight = 120;
  private gap = 10;

  private columns = 3;
  private rows = Math.ceil(menuItems.length / this.columns);

  private centerBottom = {
    x: gameScreen.width / 2,
    y: gameScreen.height - gameScreen.height / 50,
  };

  private menuWidth =
    this.columns * this.columnWidth + (this.columns - 1) * this.gap;
  private menuHeight =
    this.rows * this.columnHeight + (this.rows - 1) * this.gap;

  constructor(private setBuildingType: (type: string | undefined) => void) {
    super();

    this.draw();

    this.menuContainer.x = this.centerBottom.x - this.menuWidth / 2;
    this.menuContainer.y = this.centerBottom.y - this.menuHeight;

    this.addChild(this.menuContainer);
  }

  private draw() {
    this.makeMenuBackground();

    this.makeMenuItems();
  }

  private makeMenuBackground() {
    this.menuBackground
      .roundRect(-10, -10, this.menuWidth + 20, this.menuHeight + 20, 10)
      .fill("#cfcbc8");

    this.menuContainer.addChild(this.menuBackground);
  }

  private makeMenuItems() {
    menuItems.forEach((item, index) => {
      const column = index % this.columns;
      const row = Math.floor(index / this.columns);

      const x = column * (this.columnWidth + this.gap);
      const y = row * (this.columnHeight + this.gap);

      this.menuItemsContainers[index] = new Container();

      this.menuItemsContainers[index].position.set(x, y);

      this.createMenuItem(item, this.menuItemsContainers[index]);

      this.menuContainer.addChild(this.menuItemsContainers[index]);
    });
  }

  private createMenuItem(item: MenuItem, container: Container) {
    this.createMenuItemBackground(item.color, container, item.label);

    this.createBuildingLabel(item.label, container);

    this.createBuildingImage(item.label, container);
  }

  private createMenuItemBackground(
    backgroundColor: string,
    container: Container,
    buildingType: string,
  ) {
    const background = new Graphics()
      .roundRect(0, 0, this.columnWidth, this.columnHeight, 8)
      .fill(backgroundColor);

    background.eventMode = "static";
    background.cursor = "pointer";

    background.on("pointerdown", () => {
      this.setBuildingType(buildingType);
    });
    container.addChild(background);
  }

  private createBuildingLabel(label: string, container: Container) {
    const text = new Text({
      text: label,
      style: {
        fill: "#000000",
        fontSize: 20,
      },
    });

    text.anchor.set(0.5);

    text.x = this.columnWidth / 2;
    text.y = 18;

    text.eventMode = "none";
    container.addChild(text);
  }

  private createBuildingImage(buildingName: string, container: Container) {
    const BuildingClass = buildingMap[buildingName] || Platform;

    const building = new BuildingClass(
      this.columnWidth / 2,
      this.columnHeight / 2,
    );

    building.root.scale = 0.5;

    building.root.eventMode = "none";

    container.addChild(building.root);

    this.createBuildingRecipe(building, container);
    this.createCraftRecipe(building, container);
  }

  private createCraftRecipe(building: Building, container: Container) {
    if (building.craftRecipe) {
      building.showRecipeInfo();

      building.recipeSign.position.set(
        this.columnWidth / 2,
        this.columnHeight - 18,
      );

      container.addChild(building.recipeSign);
    }
  }

  private createBuildingRecipe(building: Building, container: Container) {
    const buildingRecipe = building.constructionRecipe;

    const recipeSign = new RecipeSign();
    recipeSign.show(
      {
        ingredients: buildingRecipe.map((ingredient) => ({
          resourceName: ingredient.resourceName,
          amount: ingredient.amount,
        })),
      },
      { layout: "vertical" },
    );
    recipeSign.position.set(this.columnWidth - 31, this.columnHeight - 90);

    container.addChild(recipeSign);
  }
}
