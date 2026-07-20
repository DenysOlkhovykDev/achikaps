import { Scenario } from "@test-poligons/test-buildings";

export const craftingResources: Scenario = {
  buildings: [
    { from: "", id: "p0", type: "Platform", x: 300, y: 450 },
    { from: "p0", id: "laboratory", type: "Laboratory", x: 500, y: 350 },
    { from: "p0", id: "factory", type: "Factory", x: 200, y: 350 },
    { from: "p0", id: "mine", type: "Mine", x: 300, y: 350 },
  ],
  workers: [
    { buildingId: "p0", profession: "production" },
    { buildingId: "p0", profession: "delivering" },
  ],
};
