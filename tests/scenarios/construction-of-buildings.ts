import { Scenario } from "@test-poligons/test-buildings";

export const constructionOfBuildings: Scenario = {
  buildings: [
    { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
    { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
    { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
  ],
  resources: [
    { buildingId: "p1", type: "Organic", count: 5 },
    { buildingId: "p2", type: "Water", count: 5 },
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
