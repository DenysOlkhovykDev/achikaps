import { Scenario } from "@test-poligons/test-buildings";

export const laboratoryConstruction: Scenario = {
  buildings: [
    { from: "", id: "p0", type: "Platform", x: 500, y: 450 },
    { from: "p0", id: "mine", type: "Mine", x: 320, y: 350 },
    { from: "p0", id: "factory", type: "Factory", x: 680, y: 350 },
    { from: "p0", id: "farm", type: "Farm", x: 500, y: 620 },
  ],
  resources: [
    { buildingId: "mine", type: "Iron", count: 5 },
    { buildingId: "factory", type: "Perl", count: 5 },
    { buildingId: "farm", type: "Meat", count: 5 },
  ],
  workers: [{ buildingId: "p0", profession: "building" }],
  buildingTasks: [
    {
      from: "p0",
      x: 500,
      y: 780,
      buildingType: "Laboratory",
    },
  ],
};
