export const resourceTypes = [
  "Iron",
  "Meat",
  "Perl",
  "Battery",
  "Gum",
  "Gear",
  "Truss",
] as const;

export type ResourceType = (typeof resourceTypes)[number];
