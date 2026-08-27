import { Scenario } from "@test-situations/test-situation";

export const autoConstructionOfBuildings: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 300, y: 450 }],
    resources: [
      { buildingId: "p0", resourceName: "Organic", amount: 2 },
      { buildingId: "p0", resourceName: "Water", amount: 2 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 300,
        y: 300,
        buildingType: "Platform",
      },
    ],
  },
};
