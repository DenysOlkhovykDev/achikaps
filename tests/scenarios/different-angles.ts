import { Scenario } from "@test-situations/test-situation";

export const differentAngles: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 600 },

      { from: "p0", id: "glassMaker1", type: "GlassMaker", x: 460, y: 600 },
      { from: "p0", id: "glassMaker2", type: "GlassMaker", x: 260, y: 600 },
      { from: "p0", id: "glassMaker3", type: "GlassMaker", x: 360, y: 500 },
      { from: "p0", id: "glassMaker4", type: "GlassMaker", x: 360, y: 700 },
    ],
    resources: [
      { buildingId: "p0", resourceName: "Water", amount: 2 },
      { buildingId: "p0", resourceName: "Organic", amount: 1 },
      { buildingId: "p0", resourceName: "Metal", amount: 3 },
      { buildingId: "glassMaker1", resourceName: "Water", amount: 2 },
      { buildingId: "glassMaker2", resourceName: "Organic", amount: 1 },
      { buildingId: "glassMaker3", resourceName: "Metal", amount: 2 },
    ],
    buildingTasks: [
      {
        from: "p0",
        x: 460,
        y: 700,
        buildingType: "GlassMaker",
      },
      {
        from: "p0",
        x: 460,
        y: 500,
        buildingType: "GlassMaker",
      },
    ],
  },
};
