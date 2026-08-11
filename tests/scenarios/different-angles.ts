import { Scenario } from "@test-situations/test-situation";

export const differentAngles: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 400, y: 500 },

      { from: "p0", id: "glassMaker1", type: "GlassMaker", x: 500, y: 500 },
      { from: "p0", id: "glassMaker2", type: "GlassMaker", x: 300, y: 500 },
      { from: "p0", id: "glassMaker3", type: "GlassMaker", x: 400, y: 400 },
      { from: "p0", id: "glassMaker4", type: "GlassMaker", x: 400, y: 600 },
    ],
    resources: [
      { buildingId: "p0", type: "Water", count: 2 },
      { buildingId: "p0", type: "Organic", count: 1 },
      { buildingId: "p0", type: "Metal", count: 3 },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 500,
        y: 600,
        buildingType: "GlassMaker",
      },
    ],
  },
};
