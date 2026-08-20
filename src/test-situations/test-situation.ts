import { Container } from "pixi.js";
import {
  getBuildingType,
  isVisibleBuildMenuTrigger,
  getIsMenuActive,
  hideBuildMenuTrigger,
} from "@menus/build-menu";

import { aircraft } from "@aircraft/aircraft";

import { Tutorials } from "../tutorial-overlay/_tutorials";
import { getDistance } from "@utils/basic-geometry";

import { autoConstructionOfBuildings } from "../../tests/scenarios/auto-construction-of-buildings";
import { collisionBlueprints } from "../../tests/scenarios/collision-blueprints";
import { movingResources } from "../../tests/scenarios/moving-resources";
import { movingBlueprints } from "../../tests/scenarios/moving-blueprints";
import { craftingResources } from "../../tests/scenarios/crafting-resources";
import { constructionOfBuildings } from "../../tests/scenarios/construction-of-buildings";
import { multipleConstructionOfBuildings } from "../../tests/scenarios/multiple-construction-of-buildings";
import { multipleConstructionOfDifferentBuildings } from "../../tests/scenarios/multiple-construction-of-different-buildings";
import { productionResources } from "../../tests/scenarios/production-resources";
import { sceneRender } from "../../tests/scenarios/scene-render";
import { showingPointers } from "../../tests/scenarios/showing-pointers";
import { differentAngles } from "../../tests/scenarios/different-angles";
import { createAirCraftByScenario } from "./test-aircraft";
import { createTestWorld } from "./test-world";
import { getWorldCoordinates } from "../main";
import { createTutorialsByScenario } from "./test-tutorials";
import { multipleDelivering } from "../../tests/scenarios/multiple-delivering";

function getScenarioName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario") || "default";
}

export type AircraftScenario = {
  buildings: {
    from: string;
    id: string;
    type: string;
    x: number;
    y: number;
  }[];

  resources?: {
    buildingId: string;
    type: string;
    count: number;
  }[];

  workers?: {
    buildingId: string;
    profession: string;
  }[];

  deliveryTasks?: {
    target: string;
    priority: number;
    resource: string;
    count: number;
  }[];

  buildingTasks?: {
    from: string;
    x: number;
    y: number;
    buildingType: string;
  }[];
};

export type TutorialsScenario = {
  pointers?: {
    condition: Function;
    x?: number;
    y?: number;
    findTarget?: Function;
  }[];

  compasses?: {
    condition: Function;
    findTarget?: Function;
  }[];

  messages?: {
    condition: Function;
    x: number;
    y: number;
    text: string;
    fontSize: number;
  }[];
};

export type Scenario = {
  aircraft: AircraftScenario;

  tutorials?: TutorialsScenario;
};

const scenarios: Record<string, Scenario> = {
  default: {
    aircraft: {
      buildings: [
        { from: "", id: "p0", type: "Platform", x: 500, y: 400 },
        { from: "p0", id: "factory", type: "Factory", x: 400, y: 350 },
        { from: "p0", id: "farm", type: "Farm", x: 600, y: 350 },
        { from: "p0", id: "mine", type: "Mine", x: 500, y: 300 },
        { from: "p0", id: "p1", type: "Platform", x: 500, y: 500 },
        { from: "p1", id: "p2", type: "Platform", x: 500, y: 600 },
      ],
      workers: [
        { buildingId: "p0", profession: "building" },
        { buildingId: "p0", profession: "production" },
        { buildingId: "p0", profession: "delivering" },
      ],
      buildingTasks: [
        {
          from: "p2",
          x: 500,
          y: 700,
          buildingType: "Engine",
        },
      ],
    },
    tutorials: {
      pointers: [
        {
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
          condition: () => {
            return (
              aircraft.blueprints.length > 0 &&
              aircraft.blueprints[0].recipeSign.root.children.length > 0
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
          condition: () => {
            return isVisibleBuildMenuTrigger();
          },
          x: 500,
          y: 950,
        },
        {
          condition: () => {
            return getIsMenuActive();
          },
          x: 500,
          y: 800,
        },
        {
          condition: () => {
            return getBuildingType() !== undefined;
          },
          x: 600,
          y: 500,
        },
        {
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
              return;
            }

            return {
              x: engines[0].x,
              y: engines[0].y,
            };
          },
        },
      ],

      compasses: [
        {
          condition: () => true,

          findTarget: () => {
            return {
              x: 1000,
              y: 100,
            };
          },
        },
      ],

      messages: [
        {
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
          x: 420,
          y: 500,
          text: "You win",
          fontSize: 44,
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
  "production-resources": productionResources,
  "scene-render": sceneRender,
};

export function createTestSituation(
  worldLayer: Container,
  tutorials: Tutorials,
) {
  const scenarioName = getScenarioName();
  const scenario = scenarios[scenarioName];

  if (!scenario) {
    throw new Error("Scenario not found: " + scenarioName);
  }

  createAirCraftByScenario(scenario.aircraft);
  if (scenario.tutorials) {
    createTutorialsByScenario(scenario.tutorials, tutorials);
  }
  createTestWorld(worldLayer);

  aircraft.hideCraftSigns();
  hideBuildMenuTrigger();
}
