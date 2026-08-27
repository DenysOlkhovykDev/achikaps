import { Scenario } from "@test-situations/test-situation";

export const multipleConstructionOfDifferentBuildings: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Organic", amount: 8 },
      { buildingId: "p2", resourceName: "Water", amount: 2 },
      { buildingId: "p2", resourceName: "Metal", amount: 1 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 300,
        buildingType: "Platform",
      },
      {
        from: "p0",
        x: 300,
        y: 600,
        buildingType: "Grinder",
      },
    ],
  },
};
