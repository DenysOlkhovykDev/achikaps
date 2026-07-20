import { blueprints } from "@buildings/_buildings";
import { Scenario } from "@test-poligons/test-buildings";
import { getDistance } from "@utils/distance";
import { worldLayer } from "../../src/main";

export const showingPointers: Scenario = {
  buildings: [{ from: "", id: "p0", type: "Platform", x: 500, y: 500 }],
  buildingTasks: [
    {
      from: "p0",
      x: 500,
      y: 350,
      buildingType: "Platform",
    },
  ],

  pointers: [
    {
      condition: () => blueprints.length > 0,

      findTarget: () => {
        const blueprint = blueprints[0];

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
          getDistance(worldLayer.pivot.x, worldLayer.pivot.y, 1000, 100) < 5000
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
};
