import { Organic } from "@resources/organic";
import { Metal } from "@resources/metal";
import { Water } from "@resources/water";
import { Battery } from "@resources/battery";
import { Gum } from "@resources/gum";
import { Gear } from "@resources/gear";
import { Truss } from "@resources/truss";

export function createResource(type: string) {
  switch (type) {
    case "Organic":
      return new Organic("Organic");
    case "Metal":
      return new Metal("Metal");
    case "Water":
      return new Water("Water");
    case "Battery":
      return new Battery("Battery");
    case "Gum":
      return new Gum("Gum");
    case "Gear":
      return new Gear("Gear");
    case "Truss":
      return new Truss("Truss");
    default:
      throw new Error("Unknown resource: " + type);
  }
}
