import { Scenario } from "@test-situations/test-situation";

export const autoConstructionOfBuildings: Scenario = {
  aircraft: {
    buildings: [{ from: "", id: "p0", type: "Platform", x: 360, y: 600 }],
    resources: [
      { buildingId: "p0", resourceName: "Organic", amount: 2 },
      { buildingId: "p0", resourceName: "Water", amount: 2 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
    buildingTasks: [
      {
        from: "p0",
        x: 360,
        y: 450,
        buildingType: "Platform",
      },
    ],
  },
};
