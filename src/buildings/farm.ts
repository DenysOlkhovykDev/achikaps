import { Building } from "@buildings/building";

export class Farm extends Building {
  constructor(x: number, y: number) {
    super(x, y, "#dba8a8", 5);
  }
}
