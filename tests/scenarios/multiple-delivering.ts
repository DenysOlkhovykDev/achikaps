import { Scenario } from "@test-situations/test-situation";

export const multipleDelivering: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 500, y: 450 },
      { from: "p0", id: "factory", type: "Factory", x: 400, y: 350 },
      { from: "p0", id: "mine", type: "Mine", x: 500, y: 350 },
      { from: "p0", id: "farm", type: "Farm", x: 600, y: 350 },
      { from: "p0", id: "smelter", type: "Smelter", x: 400, y: 450 },
      { from: "p0", id: "grinder", type: "Grinder", x: 600, y: 450 },
    ],
    workers: [
      { buildingId: "p0", profession: "production" },
      { buildingId: "p0", profession: "delivering" },
    ],
  },
};
