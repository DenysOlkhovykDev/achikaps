import { Scenario } from "@test-situations/test-situation";

export const sceneRender: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 400, y: 100 },
      { from: "p0", id: "factory", type: "Factory", x: 300, y: 100 },

      { from: "p0", id: "p1", type: "Platform", x: 400, y: 200 },
      { from: "p1", id: "mine", type: "Mine", x: 500, y: 200 },

      { from: "p1", id: "p2", type: "Platform", x: 400, y: 300 },
      { from: "p2", id: "farm", type: "Farm", x: 300, y: 300 },

      { from: "p2", id: "p3", type: "Platform", x: 400, y: 400 },
      { from: "p3", id: "house", type: "House", x: 500, y: 400 },

      { from: "p3", id: "p4", type: "Platform", x: 400, y: 500 },
      { from: "p4", id: "junkuard", type: "Junkuard", x: 280, y: 500 },

      { from: "p4", id: "p5", type: "Platform", x: 400, y: 600 },
      { from: "p5", id: "grinder", type: "Grinder", x: 500, y: 600 },

      { from: "p5", id: "p6", type: "Platform", x: 400, y: 700 },
      { from: "p6", id: "engine", type: "Engine", x: 300, y: 700 },

      { from: "p6", id: "p7", type: "Platform", x: 400, y: 800 },
      { from: "p7", id: "laboratory", type: "Laboratory", x: 500, y: 800 },

      { from: "p7", id: "p8", type: "Platform", x: 400, y: 900 },
      { from: "p8", id: "smelter", type: "Smelter", x: 300, y: 900 },
    ],
    resources: [
      { buildingId: "factory", type: "Water", count: 5 },
      { buildingId: "mine", type: "Organic", count: 5 },
      { buildingId: "farm", type: "Metal", count: 5 },
      { buildingId: "engine", type: "Battery", count: 1 },
      { buildingId: "laboratory", type: "Gum", count: 4 },
      { buildingId: "smelter", type: "Gear", count: 4 },
      { buildingId: "grinder", type: "Truss", count: 4 },
      { buildingId: "junkuard", type: "Truss", count: 1 },
      { buildingId: "junkuard", type: "Gum", count: 1 },
      { buildingId: "junkuard", type: "Gear", count: 1 },
      { buildingId: "junkuard", type: "Water", count: 1 },
      { buildingId: "junkuard", type: "Organic", count: 1 },
      { buildingId: "junkuard", type: "Metal", count: 1 },
      { buildingId: "junkuard", type: "Battery", count: 1 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
  },
};
