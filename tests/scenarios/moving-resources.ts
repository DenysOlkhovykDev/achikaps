import { Scenario } from "@test-situations/test-situation";

export const movingResources: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
      { from: "p0", id: "p1", type: "Platform", x: 500, y: 350 },
      { from: "p0", id: "p2", type: "Platform", x: 500, y: 550 },
    ],
    resources: [
      { buildingId: "p1", resourceName: "Organic", amount: 1 },
      { buildingId: "p2", resourceName: "Water", amount: 1 },
    ],
    workers: [{ buildingId: "p0", profession: "delivering" }],
    deliveryTasks: [
      {
        target: "p2",
        priority: 5,
        resource: "Organic",
        amount: 1,
      },
      {
        target: "p1",
        priority: 5,
        resource: "Water",
        amount: 1,
      },
    ],
  },
};
