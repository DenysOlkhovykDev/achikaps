import { Scenario } from "@test-situations/test-situation";

export const movingBlueprints: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 360, y: 600 }],
    buildingTasks: [
      {
        from: "p0",
        x: 365,
        y: 450,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 355,
        y: 450,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 355,
        y: 250,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 760,
        y: 600,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 360,
        y: 605,
        buildingType: "Platform",
      },
    ],
  },
};
