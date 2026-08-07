import { Scenario } from "@test-poligons/test-buildings";

export const autoConstructionOfBuildings: Scenario = {
  buildings: [{ from: "", id: "p0", type: "Platform", x: 300, y: 450 }],
  resources: [
    { buildingId: "p0", type: "Organic", count: 2 },
    { buildingId: "p0", type: "Water", count: 2 },
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
};
