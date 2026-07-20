import { Scenario } from "@test-poligons/test-buildings";

export const collisionBlueprints: Scenario = {
  buildings: [
    { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
    { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
    { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
  ],
  buildingTasks: [
    {
      from: "p0",
      x: 505,
      y: 425,
      buildingType: "Platform",
    },
    {
      from: "p0",
      x: 505,
      y: 475,
      buildingType: "Platform",
    },
  ],
};
