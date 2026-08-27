import { Container, Texture } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import { Road } from "@roads/road";
import { BlueprintRoad } from "@roads/blueprint-road";
import { JobType, Task } from "@dashboard/task";
import { Resource } from "@resources/resource";

import { Platform } from "@aircraft/platform";
import { Factory } from "@aircraft/factory";
import { Mine } from "@aircraft/mine";
import { Farm } from "@aircraft/farm";
import { Grinder } from "@aircraft/grinder";
import { Junkuard } from "@aircraft/junkuard";
import { House } from "@aircraft/house";
import { Laboratory } from "@aircraft/laboratory";
import { Smelter } from "@aircraft/smelter";
import { Engine } from "@aircraft/engine";
import { Blueprint } from "@aircraft/blueprint";
import { GlassMaker } from "@aircraft/glassMaker";
import { Workers } from "@workers/_workers";
import { RecipeIngredient } from "./building-parts/recipe-sign";

export type BuildingClass = {
  new (x: number, y: number): Building;
  config: BuildingConfig;
  baseTexture: Texture;
  constructionRecipe: RecipeIngredient[];
};

export const buildingMap: Record<string, BuildingClass> = {
  Platform,
  Factory,
  Mine,
  Farm,
  Grinder,
  Junkuard,
  House,
  Laboratory,
  Smelter,
  Engine,
  GlassMaker,
};

class Aircraft {
  public buildings: Building[] = [];
  public blueprints: Blueprint[] = [];
  public workers: Workers = new Workers();
  public selectedBuilding?: number;

  public airCraftLayer = new Container();
  public workersLayer = new Container();

  public initilaizeAircraft(stage: Container) {
    stage.addChild(this.airCraftLayer);
    stage.addChild(this.workersLayer);
  }

  public addBuilding(x: number, y: number, buildingType: string) {
    const BuildingClass = buildingMap[buildingType] || Platform;
    const building = new BuildingClass(x, y);

    const from =
      this.buildings.length > 0 && this.selectedBuilding !== undefined
        ? this.buildings[this.selectedBuilding]
        : undefined;

    if (from) {
      building.orientByBuildDirection(from);
    }

    this.buildings.push(building);
    this.airCraftLayer.addChild(building.root);

    if (from) {
      const line = new Road(from, building);

      from.addLinkedBuilding(line);
      building.addLinkedBuilding(line);

      this.airCraftLayer.addChildAt(line.graphic, 0);
    }

    return building;
  }

  public addBlueprint(x: number, y: number, buildingType: string) {
    const BuildingClass = buildingMap[buildingType] || Platform;

    const blueprint = new Blueprint(x, y, BuildingClass);

    this.blueprints.push(blueprint);
    this.airCraftLayer.addChild(blueprint.root);

    if (this.buildings.length > 0 && this.selectedBuilding !== undefined) {
      const from = this.buildings[this.selectedBuilding];

      blueprint.orientByBuildDirection(from);

      const line = new BlueprintRoad(from, blueprint);

      blueprint.addLinkedBuilding(line);

      this.airCraftLayer.addChildAt(line.graphic, 0);
      const constructionRecipe = BuildingClass.constructionRecipe;

      for (let i = 0; i < constructionRecipe.length; i++) {
        for (let j = 0; j < constructionRecipe[i].amount; j++) {
          const availableResource = from.resourceStorage.recources.find(
            (resource) =>
              resource.resourceType === constructionRecipe[i].resourceName &&
              !resource.isReserved,
          );

          if (availableResource) {
            blueprint.reserveBuildResource(availableResource);
          } else {
            const [task] = from.taskManager.addTasks(
              JobType.building,
              5,
              constructionRecipe[i].resourceName,
            );
            if (task) {
              blueprint.tasks.push(task);
            }
          }

          blueprint.buildResources.push(constructionRecipe[i].resourceName);
        }
      }

      const source = blueprint.links[0].from;

      const unsubscribe = source.unsubscribeResourceListners(
        (task: Task, resource: Resource) => {
          blueprint.onBlueprintResourceAdded(
            task,
            resource,
            this.airCraftLayer,
          );
        },
      );

      blueprint.unsubscribe = unsubscribe;
      blueprint.blueprinToBuilding(this.airCraftLayer);
    }

    return blueprint;
  }

  public selectBuilding(node: Building) {
    this.selectedBuilding = this.buildings.indexOf(node);
    this.showCraftSigns();
  }

  public deSelectAllBuildings() {
    for (const building of this.buildings) {
      building.selectShadowContainer.removeChildren();
    }

    for (const blueprint of this.blueprints) {
      blueprint.selectShadowContainer.removeChildren();
    }
  }

  public showCraftSigns() {
    this.hideCraftSigns();
    for (const blueprint of this.blueprints) {
      blueprint.showRecipeState();
    }
  }

  public hideCraftSigns() {
    for (const building of this.buildings) {
      building.hideRecipeSign();
    }
    for (const blueprint of this.blueprints) {
      blueprint.hideRecipeSign();
    }
  }

  public buildingAnimations(delta: number, movingAngle?: number) {
    for (const building of this.buildings) {
      building.animation(delta, movingAngle);
    }
  }

  public movingBlueprints(delta: number) {
    for (const blueprint of this.blueprints) {
      for (const building of this.buildings) {
        blueprint.checkAndMove(building, delta);
      }
    }
    for (const blueprint of this.blueprints) {
      for (const blueprintForCheck of this.blueprints) {
        if (blueprint !== blueprintForCheck) {
          blueprint.checkAndMove(blueprintForCheck, delta);
        }
      }
    }

    for (let i = this.blueprints.length - 1; i >= 0; i--) {
      if (this.blueprints[i].redraws > 5000) {
        this.deleteBlueprint(this.blueprints[i]);
      }
    }
  }

  public deleteBlueprint(blueprint: Blueprint) {
    blueprint.cleanup();
    let index = -1;
    for (let i = 0; i < this.blueprints.length; i++) {
      if (this.blueprints[i] === blueprint) {
        index = i;
      }
    }
    for (const link of blueprint.links) {
      link.graphic.destroy();
    }
    blueprint.root.destroy();

    if (index !== -1) {
      this.blueprints.splice(index, 1);
    }
  }
}

export const aircraft: Aircraft = new Aircraft();
