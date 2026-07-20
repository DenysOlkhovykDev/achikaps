import { Scenario } from "@test-poligons/test-buildings";

export const movingBlueprints: Scenario = {
  buildings: [{ from: "", id: "p0", type: "Platform", x: 300, y: 450 }],
  buildingTasks: [
    {
      from: "p0",
      x: 305,
      y: 300,
      buildingType: "Platform",
    },
    {
      from: "p0",
      x: 295,
      y: 300,
      buildingType: "Platform",
    },
    {
      from: "p0",
      x: 295,
      y: 100,
      buildingType: "Platform",
    },
    {
      from: "p0",
      x: 700,
      y: 450,
      buildingType: "Platform",
    },
    {
      from: "p0",
      x: 300,
      y: 455,
      buildingType: "Platform",
    },
  ],
};
