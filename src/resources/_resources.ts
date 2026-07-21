import { Iron } from "@resources/iron";
import { Meat } from "@resources/meat";
import { Perl } from "@resources/perl";
import { Battery } from "@resources/battery";
import { Gum } from "@resources/gum";
import { Gear } from "@resources/gear";
import { Truss } from "@resources/truss";

export function createResource(type: string) {
  switch (type) {
    case "Iron":
      return new Iron("Iron");
    case "Meat":
      return new Meat("Meat");
    case "Perl":
      return new Perl("Perl");
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
