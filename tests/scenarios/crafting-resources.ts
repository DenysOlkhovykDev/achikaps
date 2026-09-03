import { Scenario } from "@test-situations/test-situation";

export const craftingResources: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 600 },
      { from: "p0", id: "mixer", type: "Mixer", x: 460, y: 500 },
      { from: "p0", id: "pump", type: "Pump", x: 260, y: 500 },
      { from: "p0", id: "farm", type: "Farm", x: 360, y: 500 },
    ],
    workers: [
      { buildingId: "p0", profession: "production" },
      { buildingId: "p0", profession: "delivering" },
    ],
  },
};
