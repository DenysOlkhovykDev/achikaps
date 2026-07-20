import { Scenario } from "@test-poligons/test-buildings";

export const productionResources: Scenario = {
  buildings: [
    { from: "", id: "p0", type: "Platform", x: 500, y: 500 },
    { from: "p0", id: "factory", type: "Factory", x: 300, y: 500 },
    { from: "p0", id: "farm", type: "Farm", x: 700, y: 500 },
    { from: "p0", id: "mine", type: "Mine", x: 500, y: 300 },
  ],
  workers: [
    { buildingId: "p0", profession: "production" },
    { buildingId: "p0", profession: "building" },
  ],
  buildingTasks: [
    {
      from: "p0",
      x: 500,
      y: 700,
      buildingType: "Platform",
    },
  ],
};
