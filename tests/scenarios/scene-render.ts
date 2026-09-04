import { Scenario } from "@test-situations/test-situation";

export const sceneRender: Scenario = {
  aircraft: {
    buildings: [
      { from: "", id: "p0", type: "Platform", x: 360, y: 200 },
      { from: "p0", id: "collector", type: "Collector", x: 260, y: 200 },

      { from: "p0", id: "p1", type: "Platform", x: 360, y: 300 },
      { from: "p1", id: "farm", type: "Farm", x: 460, y: 300 },

      { from: "p1", id: "p2", type: "Platform", x: 360, y: 400 },
      { from: "p2", id: "extractor", type: "Extractor", x: 260, y: 400 },

      { from: "p2", id: "p3", type: "Platform", x: 360, y: 500 },
      { from: "p3", id: "house", type: "House", x: 460, y: 500 },

      { from: "p3", id: "p4", type: "Platform", x: 360, y: 600 },
      { from: "p4", id: "junkuard", type: "Junkuard", x: 240, y: 600 },

      { from: "p4", id: "p5", type: "Platform", x: 360, y: 700 },
      { from: "p5", id: "assembler", type: "Assembler", x: 460, y: 700 },

      { from: "p5", id: "p6", type: "Platform", x: 360, y: 800 },
      { from: "p6", id: "engine", type: "Engine", x: 260, y: 800 },

      { from: "p6", id: "p7", type: "Platform", x: 360, y: 900 },
      { from: "p7", id: "mixer", type: "Mixer", x: 460, y: 900 },

      { from: "p7", id: "p8", type: "Platform", x: 360, y: 1000 },
      { from: "p8", id: "grinder", type: "Grinder", x: 260, y: 1000 },
    ],
    resources: [
      { buildingId: "collector", resourceName: "Water", amount: 5 },
      { buildingId: "farm", resourceName: "Organic", amount: 5 },
      { buildingId: "extractor", resourceName: "Metal", amount: 5 },
      { buildingId: "engine", resourceName: "Battery", amount: 1 },
      { buildingId: "mixer", resourceName: "Gum", amount: 4 },
      { buildingId: "grinder", resourceName: "Gear", amount: 4 },
      { buildingId: "assembler", resourceName: "Truss", amount: 4 },
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
