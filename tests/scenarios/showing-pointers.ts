import { aircraft } from "@aircraft/aircraft";
import { getDistance } from "@utils/basic-geometry";
import { getWorldCoordinates } from "../../src/main";
import { Scenario } from "@test-situations/test-situation";

export const showingPointers: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 500, y: 500 }],
    buildingTasks: [
      {
        from: "p0",
        x: 500,
        y: 350,
        buildingType: "Platform",
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
            ) < 5000
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
};
