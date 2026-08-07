import { Scenario } from "@test-poligons/test-buildings";

export const newContentShowcase: Scenario = {
  buildings: [
    { from: "", id: "p0", type: "Platform", x: 500, y: 500 },
    { from: "p0", id: "mine", type: "Mine", x: 320, y: 500 },
    { from: "p0", id: "workshop", type: "Workshop", x: 680, y: 500 },
    {
      from: "p0",
      id: "manipulator",
      type: "Manipulator",
      x: 500,
      y: 650,
    },
    { from: "p0", id: "cannon", type: "Cannon", x: 330, y: 320 },
    { from: "p0", id: "machinegun", type: "MachineGun", x: 500, y: 300 },
    { from: "p0", id: "saw", type: "Saw", x: 660, y: 320 },
    {
      from: "p0",
      id: "target",
      type: "Platform",
      x: 715,
      y: 320,
      team: "enemy",
    },
  ],
  resources: [{ buildingId: "mine", type: "Iron", count: 5 }],
};
