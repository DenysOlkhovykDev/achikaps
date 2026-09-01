import { Container } from "pixi.js";
import { constructionManager } from "@construction/manager";

import { aircraft } from "@aircraft/aircraft";

import { getDistance } from "@utils/basic-geometry";

import { autoConstructionOfBuildings } from "../../tests/scenarios/auto-construction-of-buildings";
import { collisionBlueprints } from "../../tests/scenarios/collision-blueprints";
import { movingResources } from "../../tests/scenarios/moving-resources";
import { movingBlueprints } from "../../tests/scenarios/moving-blueprints";
import { craftingResources } from "../../tests/scenarios/crafting-resources";
import { constructionOfBuildings } from "../../tests/scenarios/construction-of-buildings";
import { multipleConstructionOfBuildings } from "../../tests/scenarios/multiple-construction-of-buildings";
import { multipleConstructionOfDifferentBuildings } from "../../tests/scenarios/multiple-construction-of-different-buildings";
import { craftingResourcesForConstruction } from "../../tests/scenarios/crafting-resources-for-construction";
import { sceneRender } from "../../tests/scenarios/scene-render";
import { showingPointers } from "../../tests/scenarios/showing-pointers";
import { differentAngles } from "../../tests/scenarios/different-angles";
import { createAirCraftByScenario } from "./test-aircraft";
import { createTestWorld } from "./test-world";
import { getWorldCoordinates } from "../main";
import { createUiElementsByScenario } from "./test-ui-elements";
import { multipleDelivering } from "../../tests/scenarios/multiple-delivering";
import { gameScreen } from "../game-config";

function getScenarioName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario") || "default";
}

export interface AircraftScenario {
  buildings: {
    from: string;
    id: string;
    type: string;
    x: number;
    y: number;
  }[];

  resources?: {
    buildingId: string;
    resourceName: string;
    amount: number;
  }[];

  workers?: {
    buildingId: string;
    profession: string;
  }[];

  deliveryTasks?: {
    target: string;
    priority: number;
    resource: string;
    amount: number;
  }[];

  buildingTasks?: {
    from: string;
    x: number;
    y: number;
    buildingType: string;
  }[];
}

export interface UiElementsScenario {
  tutorials?: {
    text: string;
    condition: Function;
    x?: number;
    y?: number;
    findTarget?: Function;
  }[];

  compasses?: {
    condition: Function;
    x: number;
    y: number;
  }[];
}

export interface Scenario {
  aircraft: AircraftScenario;

  uiElements?: UiElementsScenario;
}

const scenarios: Record<string, Scenario> = {
  default: {
    aircraft: {
      buildings: [
        { from: "", id: "p0", type: "Platform", x: 360, y: 600 },
        { from: "p0", id: "factory", type: "Factory", x: 260, y: 550 },
        { from: "p0", id: "farm", type: "Farm", x: 460, y: 550 },
        { from: "p0", id: "mine", type: "Mine", x: 360, y: 500 },
        { from: "p0", id: "p1", type: "Platform", x: 360, y: 700 },
        { from: "p1", id: "p2", type: "Platform", x: 360, y: 800 },
      ],
      workers: [
        { buildingId: "p0", profession: "building" },
        { buildingId: "p0", profession: "production" },
        { buildingId: "p0", profession: "delivering" },
      ],
      buildingTasks: [
        {
          from: "p2",
          x: 360,
          y: 900,
          buildingType: "Engine",
        },
      ],
    },
    uiElements: {
      tutorials: [
        {
          text: `This is the
blueprint 
of Engine`,
          condition: () => aircraft.blueprints.length > 0,
          findTarget: () => {
            const blueprint = aircraft.blueprints[0];

            if (!blueprint) {
              return;
            }
            return {
              x: blueprint.x,
              y: blueprint.y,
            };
          },
        },
        {
          text: `This is the
Platform.
You can build
from it`,
          condition: () => {
            return (
              aircraft.blueprints.length > 0 &&
              aircraft.blueprints[0].recipeSign.children.length > 0
            );
          },
          findTarget: () => {
            const building = aircraft.buildings[0];

            if (!building) {
              return;
            }

            return {
              x: building.x,
              y: building.y,
            };
          },
        },
        {
          text: `Click to open
building menu`,
          condition: () => {
            return constructionManager.isButtonVisible();
          },
          x: gameScreen.width / 2,
          y: gameScreen.height - gameScreen.height / 20,
        },
        {
          text: "Select the Lab",
          condition: () => {
            return constructionManager.isMenuVisible();
          },
          x: 360,
          y: 1070,
        },
        {
          text: `Place it 
here`,
          condition: () => {
            return constructionManager.getBuildingType() !== undefined;
          },
          x: 475,
          y: 675,
        },
        {
          text: `Also build
Smelter and 
Grinder`,
          condition: () => {
            return true;
          },
          findTarget: () => {
            const building = aircraft.buildings[0];

            if (!building) {
              return;
            }

            return {
              x: building.x,
              y: building.y,
            };
          },
        },
        {
          text: `Use Engine
to follow the
green compass 
arrow`,
          condition: () => {
            const engines = aircraft.buildings.filter(
              (b) => b.buildingType === "Engine",
            );

            return engines.length > 0;
          },
          findTarget: () => {
            const engines = aircraft.buildings.filter(
              (b) => b.buildingType === "Engine",
            );

            if (engines.length === 0) {
              return {
                x: 0,
                y: 0,
              };
            }

            return {
              x: engines[0].x,
              y: engines[0].y,
            };
          },
        },
        {
          text: `You Win`,
          condition: () => {
            if (
              getDistance(
                getWorldCoordinates().x,
                getWorldCoordinates().y,
                1000,
                100,
              ) < 50
            ) {
              return true;
            }
          },
          findTarget: () => {
            const building = aircraft.buildings[0];

            if (!building) {
              return;
            }

            return {
              x: building.x,
              y: building.y,
            };
          },
        },
      ],

      compasses: [
        {
          condition: () => {
            const engines = aircraft.buildings.filter(
              (b) => b.buildingType === "Engine",
            );

            return engines.length > 0;
          },
          x: 1000,
          y: 100,
        },
      ],
    },
  },
  // tests
  "auto-construction-of-buildings": autoConstructionOfBuildings,
  "collision-blueprints": collisionBlueprints,
  "construction-of-buildings": constructionOfBuildings,
  "crafting-resources": craftingResources,
  "different-angles": differentAngles,
  "moving-blueprints": movingBlueprints,
  "moving-resources": movingResources,
  "multiple-construction-of-buildings": multipleConstructionOfBuildings,
  "multiple-construction-of-different-buildings":
    multipleConstructionOfDifferentBuildings,
  "multiple-delivering": multipleDelivering,
  "showing-pointers": showingPointers,
  "crafting-resources-for-construction": craftingResourcesForConstruction,
  "scene-render": sceneRender,
};

export function createTestSituation(worldLayer: Container) {
  const scenarioName = getScenarioName();
  const scenario = scenarios[scenarioName];

  if (!scenario) {
    throw new Error("Scenario not found: " + scenarioName);
  }

  createAirCraftByScenario(scenario.aircraft);
  if (scenario.uiElements) {
    createUiElementsByScenario(scenario.uiElements);
  }
  createTestWorld(worldLayer);

  aircraft.hideCraftSigns();
  constructionManager.hideButton();
}
