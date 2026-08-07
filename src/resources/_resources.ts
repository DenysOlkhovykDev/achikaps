import { Iron } from "@resources/iron";
import { Meat } from "@resources/meat";
import { Perl } from "@resources/perl";
import { Battery } from "@resources/battery";
import { Gum } from "@resources/gum";
import { Gear } from "@resources/gear";
import { Truss } from "@resources/truss";
import { GlassBubble } from "@resources/glass-bubble";
import { PlasticBar } from "@resources/plastic-bar";
import { ArmorPlate } from "@resources/armor-plate";
import { Steel } from "@resources/steel";
import { Joint } from "@resources/joint";
import { Fabric } from "@resources/fabric";
import { ResourceType } from "@resources/resource-types";

export function createResource(type: ResourceType) {
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
    case "GlassBubble":
      return new GlassBubble("GlassBubble");
    case "PlasticBar":
      return new PlasticBar("PlasticBar");
    case "ArmorPlate":
      return new ArmorPlate("ArmorPlate");
    case "Steel":
      return new Steel("Steel");
    case "Joint":
      return new Joint("Joint");
    case "Fabric":
      return new Fabric("Fabric");
    default:
      throw new Error("Unknown resource: " + type);
  }
}
