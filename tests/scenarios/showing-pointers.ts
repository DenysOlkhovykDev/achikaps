import { aircraft } from "@aircraft/aircraft";
import { getDistance } from "@utils/basic-geometry";
import { getWorldCoordinates } from "../../src/main";
import { Scenario } from "@test-situations/test-situation";
import { gameScreen } from "../../src/game-config";

export const showingPointers: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 360, y: 600 }],
    buildingTasks: [
      {
        from: "p0",
        x: 360,
        y: 450,
        buildingType: "Platform",
      },
    ],
  },
  uiElements: {
    tutorials: [
      {
        text: `Hello world`,
        showCondition: () => aircraft.blueprints.length > 0,
        hideCondition: () => false,
        needOkButton: true,
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
    ],

    compasses: [
      {
        condition: () => {
          return true;
        },
        x: 1000,
        y: 100,
      },
    ],
  },
};
