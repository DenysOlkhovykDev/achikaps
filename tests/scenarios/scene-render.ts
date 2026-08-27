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
      { buildingId: "factory", resourceName: "Water", amount: 5 },
      { buildingId: "mine", resourceName: "Organic", amount: 5 },
      { buildingId: "farm", resourceName: "Metal", amount: 5 },
      { buildingId: "engine", resourceName: "Battery", amount: 1 },
      { buildingId: "laboratory", resourceName: "Gum", amount: 4 },
      { buildingId: "smelter", resourceName: "Gear", amount: 4 },
      { buildingId: "grinder", resourceName: "Truss", amount: 4 },
      { buildingId: "junkuard", resourceName: "Truss", amount: 1 },
      { buildingId: "junkuard", resourceName: "Gum", amount: 1 },
      { buildingId: "junkuard", resourceName: "Gear", amount: 1 },
      { buildingId: "junkuard", resourceName: "Water", amount: 1 },
      { buildingId: "junkuard", resourceName: "Organic", amount: 1 },
      { buildingId: "junkuard", resourceName: "Metal", amount: 1 },
      { buildingId: "junkuard", resourceName: "Battery", amount: 1 },
    ],
    workers: [{ buildingId: "p0", profession: "building" }],
  },
};
