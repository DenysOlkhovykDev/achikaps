import { Scenario } from "@test-poligons/test-buildings";

export const movingResources: Scenario = {
  buildings: [
    { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
    { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
    { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
  ],
  resources: [
    { buildingId: "p1", type: "Iron", count: 1 },
    { buildingId: "p2", type: "Perl", count: 1 },
  ],
  workers: [{ buildingId: "p0", profession: "delivering" }],
  deliveryTasks: [
    {
      target: "p2",
      priority: 5,
      resource: "Iron",
      count: 1,
    },
    {
      target: "p1",
      priority: 5,
      resource: "Perl",
      count: 1,
    },
  ],
};
