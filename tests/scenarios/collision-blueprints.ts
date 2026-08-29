import { Scenario } from "@test-situations/test-situation";

export const collisionBlueprints: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 600 },
      { from: "p0", id: "p1", type: "Platform", x: 560, y: 500 },
      { from: "p0", id: "p2", type: "Platform", x: 560, y: 700 },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 565,
        y: 575,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 565,
        y: 625,
        buildingType: "Platform",
      },
    ],
  },
};
