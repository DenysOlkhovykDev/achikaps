import { Container } from "pixi.js";
import { ConstructionButton } from "./button";
import { ConstructionMenu } from "./menu";

export class ConstructionManager extends Container {
  button: ConstructionButton | undefined = undefined;
  menu: ConstructionMenu | undefined = undefined;

  buildingType: string | undefined = undefined;

  public initialize() {
    this.button = new ConstructionButton();
    this.menu = new ConstructionMenu(this.setBuildingType);

    this.button.eventMode = "static";

    this.button.on("pointerdown", (e) => {
      this.showMenu();
      e.stopPropagation();
    });

    this.addChild(this.button);

    this.menu.eventMode = "static";

    this.menu.on("pointerdown", (e) => {
      this.hideMenu();
      e.stopPropagation();
    });

    this.hideMenu();

    this.addChild(this.menu);
  }

  public showMenu() {
    if (this.menu) {
      this.hideButton();
      this.menu.visible = true;
    }
  }

  public hideMenu() {
    if (this.menu) {
      this.menu.visible = false;
    }
  }

  public isMenuVisible() {
    if (this.menu) {
      return this.menu.visible;
    }
  }

  public showButton() {
    if (this.button) {
      this.button.visible = true;
    }
  }

  public hideButton() {
    if (this.button) {
      this.button.visible = false;
    }
  }

  public isButtonVisible() {
    if (this.button) {
      return this.button.visible;
    }
  }

  public setBuildingType = (type: string | undefined) => {
    this.buildingType = type;
  };

  public getBuildingType() {
    return this.buildingType;
  }
}

export const constructionManager = new ConstructionManager();
