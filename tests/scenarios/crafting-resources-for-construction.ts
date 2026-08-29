import { Scenario } from "@test-situations/test-situation";

export const craftingResourcesForConstruction: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 600 },
      { from: "p0", id: "factory", type: "Factory", x: 260, y: 600 },
      { from: "p0", id: "farm", type: "Farm", x: 460, y: 600 },
      { from: "p0", id: "mine", type: "Mine", x: 360, y: 500 },
    ],
    workers: [
      { buildingId: "p0", profession: "production" },
      { buildingId: "p0", profession: "building" },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 360,
        y: 800,
        buildingType: "Platform",
      },
    ],
  },
};
