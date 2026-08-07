export const resourceTypes = [
  "Iron",
  "Meat",
  "Perl",
  "Battery",
  "Gum",
  "Gear",
  "Truss",
  "GlassBubble",
  "PlasticBar",
  "ArmorPlate",
  "Steel",
  "Joint",
  "Fabric",
] as const;

export type ResourceType = (typeof resourceTypes)[number];
